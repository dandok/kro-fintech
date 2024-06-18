import {
  BadRequestException,
  ConflictException,
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

@Injectable()
export class AuthService {
  private logger: Logger;

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
    //TODO: account lock based on multiple failed attempts,
    //check user, check if suspended, password match, 3 attempts, lock
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
    return { user: authHelpers.serializeUser(existingUser), token };
  }
}
