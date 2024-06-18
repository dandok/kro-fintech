import { User } from '../user/user.entity';

type TUser = User;
type TSerializedUser = Omit<TUser, 'password'>;

type TResponse<T = null> = {
  data?: T | T[];
  status: number;
  message: string;
};

type TQueryParams = {
  limit?: number;
  page?: number;
};

export type { TUser, TSerializedUser, TResponse, TQueryParams };
