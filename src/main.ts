import { config } from 'dotenv';
config();
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MainCluster } from './main.cluster';

async function bootstrap() {
  const logger = new Logger('MAIN');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const PORT = process.env.PORT || 8000;
  await app.listen(PORT, () => logger.log(`Server running on port ${PORT}`));
}
MainCluster.clusterize(bootstrap);
