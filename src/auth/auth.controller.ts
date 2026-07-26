import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { type Response, type Request, CookieOptions } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { type AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() signupDto: SignupDTO) {
    const user = await this.authService.signup(signupDto);
    return {
      status: 'success',
      message: 'User registered successfully',
      user,
    };
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);

    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    };
    response.cookie('access_token', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      status: 'success',
      message: 'User logged in successfully',
      user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() request: AuthenticatedRequest) {
    return this.authService.getMe(request.user.sub);
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies as Record<string, unknown>;
    const refreshToken = cookies.refresh_token;
    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token required');
    }
    const token = await this.authService.refreshAccessToken(refreshToken);

    response.cookie('access_token', token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return {
      message: 'Access token refreshed successfully',
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      message: 'Logout successful',
    };
  }

  @Get('admin-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminTest() {
    return {
      message: 'Welcome Admin',
    };
  }
}
