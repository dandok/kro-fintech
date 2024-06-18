import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TSerializedUser, TUser } from '../@types/app.types';

const jwt = new JwtService();

const generateToken = async (user: TUser): Promise<string> => {
  return await jwt.signAsync({ id: user.id, email: user.email });
};

const serializeUser = (user: TUser): TSerializedUser => {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...serializedUser } = user;
  return serializedUser;
};

const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 10);
};

const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return compare(password, hash);
};

export const authHelpers = {
  serializeUser,
  hashPassword,
  verifyPassword,
  generateToken,
};
