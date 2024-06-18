import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import defaultUser from '../db/data/user.data';
import { SignupDto } from './dto/signup.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login an existing user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: defaultUser.email, password: defaultUser.password });

    expect(response.body).toBeDefined();
    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(defaultUser.email);
    expect(response.body.token).toBeDefined();
  });

  it('should fail to login with incorrect credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: defaultUser.email, password: 'IncorrectPassword' });

    expect(response.body).toBeDefined();
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should fail to login with if user does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'random@example.com', password: 'IncorrectPassword' });

    expect(response.body).toBeDefined();
    expect(response.body.message).toBe('user not found');
  });

  it('should signup a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        first_name: 'Joan',
        last_name: 'Smith',
        email: 'joan@example.com',
        password: 'Password!23*',
        confirm_password: 'Password!23*',
      } as SignupDto);

    expect(response.body).toBeDefined();
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe('joan@example.com');
    expect(response.body.token).toBeDefined();
  });

  it('should fail to signup due to validation errors', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        first_name: 'Joan',
        last_name: 'Smith',
        email: 'dokubodaniel@.com',
        password: 'Password23',
        confirm_password: 'XXXXXXXX!23',
      } as SignupDto);

    expect(response.body).toBeDefined();
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'email must be an email',
        "password and confirm_password don't match",
      ]),
    );
  });
});
