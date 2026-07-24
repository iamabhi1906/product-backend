import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ProductsController } from './products/products.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule],
  controllers: [UsersController, ProductsController],
})
export class AdminModule {}
