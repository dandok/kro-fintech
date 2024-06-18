import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TQueryParams } from '../@types/app.types';

@Injectable()
export class TransactionService {
  private logger: Logger;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async fetchMyTransactions(id: number, searchParam: TQueryParams) {
    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.user = :id', { id })
      .skip((searchParam.page - 1) * searchParam.limit)
      .take(searchParam.limit);

    const [transactions, count] = await query
      .orderBy('transaction.created_at', 'DESC')
      .getManyAndCount();

    return { transactions, count };
  }
}
