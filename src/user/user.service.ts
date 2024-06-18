import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createEntity } from '../utils/entity.utils';
import { authHelpers } from 'src/helpers/auth.helpers';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UserService {
  private logger;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
}
