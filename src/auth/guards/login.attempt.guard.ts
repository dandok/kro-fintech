import {
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { Inject } from '@nestjs/common';

@Injectable()
export class LoginAttemptsGuard implements CanActivate {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;

    if (!email) throw new BadRequestException('Email is required');

    const lockUntilKey = `lock_until:${email}`;

    const lockedUntil = await this.redisClient.get(lockUntilKey);
    if (lockedUntil && new Date(lockedUntil) > new Date())
      throw new BadRequestException(
        'Account locked due to multiple failed attempts',
      );

    return true;
  }
}
