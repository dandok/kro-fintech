import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import {
  mockQueryBuilder,
  userId,
  searchParams,
  mockTransactions,
  mockCount,
} from '../test-mocks/transaction.mock';

describe('TransactionService', () => {
  let service: TransactionService;
  let repositoryMock: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repositoryMock = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should fetch transactions successfully', async () => {
    jest
      .spyOn(repositoryMock, 'createQueryBuilder')
      .mockReturnValue(mockQueryBuilder as any);

    const result = await service.fetchMyTransactions(userId, searchParams);

    expect(result).toBeDefined();
    expect(result.transactions).toEqual(mockTransactions);
    expect(result.count).toBe(mockCount);
    expect(repositoryMock.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'transaction.user = :id',
      { id: userId },
    );
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(
      (searchParams.page - 1) * searchParams.limit,
    );
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(searchParams.limit);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'transaction.created_at',
      'DESC',
    );
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  });
});
