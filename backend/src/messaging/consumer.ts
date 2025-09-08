import * as amqplib from 'amqplib';

async function bootstrap() {
  const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
  const exchange = 'vehicles.events';
  const conn = await amqplib.connect(url);
  const ch = await conn.createChannel();
  await ch.assertExchange(exchange, 'topic', { durable: true });
  const q = await ch.assertQueue('vehicles.events.log', { durable: true });
  await ch.bindQueue(q.queue, exchange, 'vehicle.*');
  console.log('Consumer waiting for vehicle events...');
  ch.consume(q.queue, (msg) => {
    if (!msg) return;
    const content = msg.content.toString();
    console.log(`[event][${msg.fields.routingKey}] ${content}`);
    ch.ack(msg);
  });
}

bootstrap().catch((err) => {
  console.error('Consumer failed', err);
  process.exit(1);
});
