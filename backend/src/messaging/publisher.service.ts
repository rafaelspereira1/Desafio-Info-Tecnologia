import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitmqPublisherService implements OnModuleInit, OnModuleDestroy {
  private connection?: amqplib.Connection;
  private channel?: amqplib.Channel;
  private readonly logger = new Logger(RabbitmqPublisherService.name);
  private readonly exchange = 'vehicles.events';

  async onModuleInit() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchange, 'topic', {
        durable: true,
      });
      this.logger.log('RabbitMQ publisher connected');
    } catch (e) {
      this.logger.error('Failed to init RabbitMQ', e as Error);
    }
  }

  async publish(routingKey: string, payload: unknown) {
    if (!this.channel) return;
    this.channel.publish(
      this.exchange,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        contentType: 'application/json',
        persistent: true,
      },
    );
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }
}
