import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/role.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtAuthGuard, RolesGuard],

  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
