import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import defaultUser from '../db/data/user.data';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: defaultUser.email, password: defaultUser.password });

    const responseBody = JSON.parse(response.text);
    authToken = responseBody.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user/transactions (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ page: 1, limit: 10 })
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(response.body.message).toBe('Transactions fetched successfully');
    expect(response.body.transactions).toBeDefined();
    expect(Array.isArray(response.body.transactions)).toBe(true);
  });

  it('/user/transactions (GET) - should fail with unauthorized when not logged in', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/transactions')
      .query({ page: 1, limit: 10 })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body).toBeDefined();
    expect(response.body.message).toBe('Unauthorized');
  });
});
