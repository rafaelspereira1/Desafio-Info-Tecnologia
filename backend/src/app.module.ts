import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [VehiclesModule, MessagingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
