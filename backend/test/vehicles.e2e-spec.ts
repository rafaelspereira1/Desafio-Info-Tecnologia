import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('VehiclesController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/vehicles (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/vehicles')
      .send({
        placa: 'DEF2G34',
        chassi: 'ABCDEFGH123456789',
        renavam: '987654321',
        modelo: 'Model 3',
        marca: 'Tesla',
        ano: 2024,
      })
      .expect(201);
    createdId = res.body.id;
    expect(res.body.placa).toBe('DEF2G34');
  });

  it('/vehicles (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/vehicles').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/vehicles/:id (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/vehicles/${createdId}`)
      .expect(200);
    expect(res.body.id).toBe(createdId);
  });
});
