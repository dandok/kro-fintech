import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.entity';
import { authHelpers } from '../helpers/auth.helpers';
import {
  existingUser,
  loginData,
  signupData,
  wrongLoginDto,
} from '../test-mocks/user.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user and return a token', async () => {
      const hashedPassword = '$2b$10$hashedpasswordhash';
      const user: Partial<User> = {
        id: 1,
        email: signupData.email,
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(authHelpers, 'hashPassword').mockResolvedValue(hashedPassword);
      jest.spyOn(userService, 'createUser').mockResolvedValue(user as User);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedtoken');

      const result = await authService.signup(signupData);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(
        signupData.email,
      );
      expect(authHelpers.hashPassword).toHaveBeenCalledWith(
        signupData.password,
      );
      expect(userService.createUser).toHaveBeenCalledWith({
        ...signupData,
        password: hashedPassword,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
      expect(result).toEqual({ user, token: 'mockedtoken' });
    });

    it('should throw ConflictException if user already exists', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue({} as User);

      await expect(authService.signup(signupData)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return a token if login is successful', async () => {
      jest
        .spyOn(userService, 'findUserByEmail')
        .mockResolvedValue(existingUser);
      jest.spyOn(authHelpers, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedtoken');

      const result = await authService.login(loginData);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(loginData.email);
      expect(authHelpers.verifyPassword).toHaveBeenCalledWith(
        loginData.password,
        existingUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: loginData.email,
      });
      expect(result).toEqual({ token: 'mockedtoken' });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if password does not match', async () => {
      jest
        .spyOn(userService, 'findUserByEmail')
        .mockResolvedValue(existingUser);
      jest.spyOn(authHelpers, 'verifyPassword').mockResolvedValue(false);

      await expect(authService.login(wrongLoginDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
