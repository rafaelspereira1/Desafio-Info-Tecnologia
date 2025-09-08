import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehicleRepository } from './vehicle.repository';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleRepository],
  exports: [VehiclesService],
})
export class VehiclesModule {}
