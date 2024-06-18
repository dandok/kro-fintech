import { User } from '../user/user.entity';

type TUser = User;
type TSerializedUser = Omit<TUser, 'password'>;

export type { TUser, TSerializedUser };
