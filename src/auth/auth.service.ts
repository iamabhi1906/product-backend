import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDTO } from './dto/signup.dto';
import { User, UserResponse } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { randomUUID } from 'crypto';
import { UserRole } from '../users/enums/user-role.enum';
import { LoginDTO } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signup(signupDto: SignupDTO): UserResponse {
    const { email } = signupDto;
    const existingUser = this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const payload: User = {
      id: randomUUID(),
      ...signupDto,
      role: UserRole.USER,
      createdAt: new Date(),
    };
    this.usersService.create(payload);
    const response: UserResponse = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      createdAt: payload.createdAt,
    };
    return response;
  }

  async login(loginDto: LoginDTO) {
    const user = this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = user.password === loginDto.password;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const response: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    const tokens = await this.generateTokens(user.id, user.role);
    return {
      user: response,
      tokens,
    };
  }

  private async generateTokens(userId: string, role: UserRole) {
    const payload = { sub: userId, role };
    const accessExpiresIn = this.configService.getOrThrow<
      JwtSignOptions['expiresIn']
    >('JWT_ACCESS_EXPIRES_IN');

    const refreshExpiresIn = this.configService.getOrThrow<
      JwtSignOptions['expiresIn']
    >('JWT_REFRESH_EXPIRES_IN');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: accessExpiresIn,
      }),

      this.jwtService.signAsync(payload, {
        expiresIn: refreshExpiresIn,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const user = this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }
      const token = this.generateTokens(user.id, user.role);
      return token;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  getMe(userId: string): UserResponse {
    const user = this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
