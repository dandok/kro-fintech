import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { TResponse } from '../@types/app.types';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { LoginAttemptsGuard } from './guards/login.attempt.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignupDto): Promise<TResponse<Partial<User>>> {
    const response = await this.authService.signup(data);
    return {
      ...response,
      status: HttpStatus.OK,
      message: 'User created successfully',
    };
  }

  @Post('login')
  @UseGuards(LoginAttemptsGuard)
  async login(@Body() data: LoginDto): Promise<TResponse<string>> {
    const response = await this.authService.login(data);
    return {
      ...response,
      status: HttpStatus.OK,
      message: 'Login successful',
    };
  }
}
