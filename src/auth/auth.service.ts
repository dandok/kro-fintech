import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import { authHelpers } from 'src/helpers/auth.helpers';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private logger;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async signup(
    data: SignupDto,
  ): Promise<{ user: Partial<User>; token: string }> {
    const existingUser = await this.userService.findUserByEmail(data.email);
    if (existingUser) throw new BadRequestException('user already exists');

    const hashedPassword = await authHelpers.hashPassword(data.password);
    const userDataWithHashedPassword = {
      ...data,
      password: hashedPassword,
    };

    const token = await this.jwtService.signAsync(data.email);
    return {
      user: await this.userService.createUser(userDataWithHashedPassword),
      token,
    };
  }

  async login(data: LoginDto) {
    //TODO: account lock based on multiple failed attempts
    const existingUser = await this.userService.findUserByEmail(data.email);
    if (!existingUser) throw new NotFoundException('user not found');

    const passwordMatch = await authHelpers.verifyPassword(
      data.password,
      existingUser.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({ email: data.email });
    return { token };
  }
}