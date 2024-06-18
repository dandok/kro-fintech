import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import defaultUser from '../data/user.data';
import { authHelpers } from '../../helpers/auth.helpers';
import { Transaction } from '../../transaction/transaction.entity';
import transactions from '../data/transaction.data';

@Injectable()
export class SeedsService implements OnModuleInit {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Transaction)
    private transRepo: Repository<Transaction>,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async onModuleInit() {
    await this.seedUser();
    await this.seedTransaction();
  }

  async seedUser() {
    try {
      this.logger.log('seeding user data');

      const user = await this.userRepo.findOne({
        where: { email: defaultUser.email },
      });

      if (!user) {
        defaultUser.password = await authHelpers.hashPassword(
          defaultUser.password,
        );

        await this.userRepo.save(defaultUser);
      }

      this.logger.log('done seeding');
    } catch (error) {
      this.logger.log(error);
    }
  }

  async seedTransaction() {
    try {
      this.logger.log('seeding transaction data');

      const user = await this.userRepo.findOne({
        where: { email: defaultUser.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const savedTransactions = (await this.transRepo.find()).map(
        (obj) => obj.ref,
      );

      const transactionsToSeed = transactions.filter(
        (obj) => !savedTransactions.includes(obj.ref),
      );

      const transactionEntities = transactionsToSeed.map((t) => ({
        ...t,
        user,
      }));

      await this.transRepo.save(transactionEntities);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
