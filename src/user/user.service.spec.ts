import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { authHelpers } from '../helpers/auth.helpers';
import { savedUser, signupData } from '../test-mocks/user.mock';
import { TransactionService } from '../transaction/transaction.service';

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: TransactionService,
          useValue: { fetchMyTransactions: jest.fn() },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find user by email', async () => {
    jest
      .spyOn(repositoryMock, 'findOneBy')
      .mockResolvedValueOnce(savedUser as User);

    const result = await service.findUserByEmail(savedUser.email);

    expect(result).toEqual(savedUser);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
      email: savedUser.email,
    });
  });

  it('should create a new user', async () => {
    const serializedUser = authHelpers.serializeUser(savedUser as User);

    jest.spyOn(repositoryMock, 'save').mockResolvedValueOnce(savedUser as User);

    const result = await service.createUser(signupData);

    expect(result).toEqual(serializedUser);
    expect(repositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: signupData.email,
        password: expect.any(String),
      }),
    );
  });
});
