import { Global, Module } from '@nestjs/common';
import { RabbitmqPublisherService } from './publisher.service';

@Global()
@Module({
  providers: [RabbitmqPublisherService],
  exports: [RabbitmqPublisherService],
})
export class MessagingModule {}
