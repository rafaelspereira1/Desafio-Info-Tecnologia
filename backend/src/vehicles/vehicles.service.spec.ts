import { VehiclesService } from './vehicles.service';
import { VehicleRepository } from './vehicle.repository';
import { RabbitmqPublisherService } from '../messaging/publisher.service';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let repo: VehicleRepository;
  const publisher: Partial<RabbitmqPublisherService> = {
    publish: async () => undefined,
  };

  beforeEach(() => {
    repo = new VehicleRepository();
    service = new VehiclesService(repo, publisher as RabbitmqPublisherService);
  });

  it('creates a vehicle', async () => {
    const created = await service.create({
      placa: 'ABC1D23',
      chassi: '12345678901234567',
      renavam: '123456789',
      modelo: 'Modelo X',
      marca: 'Marca Y',
      ano: 2024,
    });
    expect(created.id).toBeDefined();
    const all = await service.list();
    expect(all.length).toBeGreaterThan(0);
  });
});
