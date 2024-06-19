import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { RedisModule } from '../auth/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TransactionModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
