import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

const DATA_FILE = join(process.cwd(), 'data', 'vehicles.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

export class VehicleRepository {
  private async readAll(): Promise<Vehicle[]> {
    await ensureDataFile();
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Vehicle[];
  }

  private async persist(all: Vehicle[]): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2));
  }

  async findAll(): Promise<Vehicle[]> {
    return this.readAll();
  }

  async findById(id: string): Promise<Vehicle | undefined> {
    const all = await this.readAll();
    return all.find((v) => v.id === id);
  }

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const all = await this.readAll();
    const now = new Date().toISOString();
    const vehicle: Vehicle = {
      id: randomUUID(),
      ...dto,
      createdAt: now,
      updatedAt: now,
    };
    all.push(vehicle);
    await this.persist(all);
    return vehicle;
  }

  async update(
    id: string,
    dto: UpdateVehicleDto,
  ): Promise<Vehicle | undefined> {
    const all = await this.readAll();
    const idx = all.findIndex((v) => v.id === id);
    if (idx === -1) return undefined;
    const updated: Vehicle = {
      ...all[idx],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    await this.persist(all);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const all = await this.readAll();
    const lenBefore = all.length;
    const filtered = all.filter((v) => v.id !== id);
    if (filtered.length === lenBefore) return false;
    await this.persist(filtered);
    return true;
  }

  async findByUniqueFields(
    placa: string,
    chassi: string,
    renavam: string,
  ): Promise<Vehicle | undefined> {
    const all = await this.readAll();
    return all.find(
      (v) => v.placa === placa || v.chassi === chassi || v.renavam === renavam,
    );
  }
}
