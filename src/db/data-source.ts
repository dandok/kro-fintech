import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Transaction } from '../transaction/transaction.entity';
import { User } from '../user/user.entity';
config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get('DB_PORT')) || 5432,
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, Transaction],
  // migrations: ['dist/db/migrations/*.js'],

  synchronize: true, //only for the purpose of testing - migration should be used in production
  ssl:
    configService.get('NODE_ENV') === 'staging'
      ? true
      : configService.get('NODE_ENV') === 'production' && {
          rejectUnauthorized: false,
          ca: configService.get('DB_CERT'),
          requestCert: true,
        },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
