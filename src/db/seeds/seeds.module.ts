import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { SeedsService } from './seeds.service';
import { Transaction } from '../../transaction/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])],
  controllers: [],
  providers: [SeedsService],
})
export class SeedsModule {}
