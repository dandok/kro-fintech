import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from '../auth/dto/signup.dto';
import { User } from '../user/user.entity';

export const signupData: SignupDto = {
  email: 'test@example.com',
  password: 'Password123**',
  first_name: 'test',
  last_name: 'tester',
  confirm_password: 'Password123**',
};

export const loginData: LoginDto = {
  email: 'test@example.com',
  password: 'Password123**',
};

export const existingUser: User = {
  id: 1,
  email: loginData.email,
  password: 'hashedpassword',
  first_name: 'test',
  last_name: 'tested',
  transactions: [],
  created_at: new Date(),
  updated_at: new Date(),
};

export const wrongLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'wrongpassword',
};

export const savedUser = {
  id: 1,
  email: signupData.email,
  password: 'hashedPassword',
};
