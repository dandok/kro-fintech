import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import { authHelpers } from '../helpers/auth.helpers';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import Redis from 'ioredis';
import { LOCK_DURATION, MAX_ATTEMPTS } from '../utils/constants';

@Injectable()
export class AuthService {
  private logger: Logger;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async signup(
    data: SignupDto,
  ): Promise<{ user: Partial<User>; token: string }> {
    const existingUser = await this.userService.findUserByEmail(data.email);
    if (existingUser) throw new ConflictException('user already exists');

    const hashedPassword = await authHelpers.hashPassword(data.password);
    const userDataWithHashedPassword = {
      ...data,
      password: hashedPassword,
    };

    const user = await this.userService.createUser(userDataWithHashedPassword);
    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return { user, token };
  }

  async login(data: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    const existingUser = await this.userService.findUserByEmail(data.email);
    if (!existingUser) throw new NotFoundException('user not found');

    const passwordMatch = await authHelpers.verifyPassword(
      data.password,
      existingUser.password,
    );

    if (!passwordMatch) {
      await this.incrementFailedAttempts(data.email);
      throw new BadRequestException('Invalid credentials');
    }

    await this.resetFailedAttempts(data.email);
    const token = await this.jwtService.signAsync({ email: data.email });
    return { user: authHelpers.serializeUser(existingUser), token };
  }

  private async incrementFailedAttempts(email: string) {
    const failedLoginAttemptsKey = `failed_login_attempts:${email}`;
    const lockUntilKey = `lock_until:${email}`;

    const currentFailedAttempts = await this.redisClient.incr(
      failedLoginAttemptsKey,
    );

    if (currentFailedAttempts > MAX_ATTEMPTS) {
      const lockDuration = LOCK_DURATION;
      const lockUntil = new Date(Date.now() + lockDuration * 1000);

      await this.redisClient.set(
        lockUntilKey,
        lockUntil.toISOString(),
        'EX',
        lockDuration,
      );

      await this.redisClient.del(failedLoginAttemptsKey);

      throw new BadRequestException(
        'Account locked due to multiple failed attempts',
      );
    }
  }

  private async resetFailedAttempts(email: string) {
    const failedLoginAttemptsKey = `failed_login_attempts:${email}`;
    await this.redisClient.del(failedLoginAttemptsKey);
  }
}
