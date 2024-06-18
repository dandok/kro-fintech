import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { dataSourceOptions } from './db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';
import { SeedsModule } from './db/seeds/seeds.module';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from './helpers/exceptionFilter.helpers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    TransactionModule,
    SeedsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule {}
