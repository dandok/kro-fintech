import { Controller, Get, HttpStatus, Query, Headers } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current.user.decorator';
import { User } from './user.entity';
import { TQueryParams, TResponse } from '../@types/app.types';
import { Transaction } from '../transaction/transaction.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('transactions')
  async fetchMyTransactions(
    @CurrentUser() user: Partial<User>,
    @Query() query: TQueryParams,
  ): Promise<TResponse<Transaction>> {
    const response = await this.userService.fetchMyTransactions(user.id, {
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
