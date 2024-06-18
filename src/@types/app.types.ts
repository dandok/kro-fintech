import { User } from '../user/user.entity';

type TUser = User;
type TSerializedUser = Omit<TUser, 'password'>;

type TResponse<T = null> = {
  data?: T | T[];
  status: number;
  message: string;
};

export type { TUser, TSerializedUser, TResponse };
