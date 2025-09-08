import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { VehicleRepository } from './vehicle.repository';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './vehicle.entity';
import { RabbitmqPublisherService } from '../messaging/publisher.service';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly repo: VehicleRepository,
    private readonly publisher: RabbitmqPublisherService,
  ) {}

  list(): Promise<Vehicle[]> {
    return this.repo.findAll();
  }

  async get(id: string): Promise<Vehicle> {
    const v = await this.repo.findById(id);
    if (!v) throw new NotFoundException('Veículo não encontrado');
    return v;
  }

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const exists = await this.repo.findByUniqueFields(
      dto.placa,
      dto.chassi,
      dto.renavam,
    );
    if (exists)
      throw new BadRequestException(
        'Veículo com placa/chassi/renavam já cadastrado',
      );
    const created = await this.repo.create(dto);
    await this.publisher.publish('vehicle.created', created);
    return created;
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException('Veículo não encontrado');
    await this.publisher.publish('vehicle.updated', updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const ok = await this.repo.remove(id);
    if (!ok) throw new NotFoundException('Veículo não encontrado');
    await this.publisher.publish('vehicle.deleted', { id });
  }
}
