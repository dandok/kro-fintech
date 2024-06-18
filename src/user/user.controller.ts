import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current.user.decorator';
import { User } from './user.entity';
import { TransactionService } from '../transaction/transaction.service';
import { TQueryParams, TResponse } from '../@types/app.types';
import { Transaction } from '../transaction/transaction.entity';

@Controller('user')
export class UserController {
  constructor(private readonly transService: TransactionService) {}

  @Get('transactions')
  async fetchMyTransactions(
    @CurrentUser() user: Partial<User>,
    @Query() query: TQueryParams,
  ): Promise<TResponse<Transaction>> {
    const response = await this.transService.fetchMyTransactions(user.id, {
      page: query?.page || 1,
      limit: query?.limit || 15,
    });
    return {
      ...response,
      status: HttpStatus.OK,
      message: 'Transactions fetched successfully',
    };
  }
}
