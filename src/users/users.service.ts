import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(user: User): User {
    this.users.push(user);
    return user;
  }
}
