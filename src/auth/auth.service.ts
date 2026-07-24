import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDTO } from './dto/signup.dto';
import { UserResponse } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { LoginDTO } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDTO): Promise<UserResponse> {
    const { email } = signupDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const newUser = await this.usersService.create({
      ...signupDto,
      password: hashedPassword,
      role: signupDto.role ?? UserRole.USER,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isBlocked: newUser.isBlocked,
      createdAt: newUser.createdAt,
    };
  }

  async login(loginDto: LoginDTO) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const response: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    };
    const tokens = await this.generateTokens(user.id, user.role);
    return {
      user: response,
      tokens,
    };
  }

  private async generateTokens(userId: number, role: UserRole) {
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
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }
      const token = this.generateTokens(user.id, user.role);
      return token;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    };
  }
}
