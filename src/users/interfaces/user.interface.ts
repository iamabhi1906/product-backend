import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export type UserResponse = Omit<User, 'password'>;
