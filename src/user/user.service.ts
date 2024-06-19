import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createEntity } from '../utils/entity';
import { authHelpers } from '../helpers/auth.helpers';
import { SignupDto } from '../auth/dto/signup.dto';
import { TransactionService } from '../transaction/transaction.service';
import { TQueryParams } from '../@types/app.types';

@Injectable()
export class UserService {
  private logger: Logger;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly transService: TransactionService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepo.findOneBy({ email });
  }

  async createUser(data: SignupDto): Promise<Partial<User>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, ...userData } = data;
    const user = await this.userRepo.save(await createEntity(User, userData));
    return authHelpers.serializeUser(user);
  }

  async fetchMyTransactions(id: number, searchParam: TQueryParams) {
    return await this.transService.fetchMyTransactions(id, searchParam);
  }
}
