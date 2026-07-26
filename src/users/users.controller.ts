import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('profile')
  getProfile(@Req() request: AuthenticatedRequest) { return this.users.findById(request.user.sub); }

  @Patch('profile')
  updateProfile(@Req() request: AuthenticatedRequest, @Body() dto: UpdateUserDto) { return this.users.updateProfile(request.user.sub, dto); }
}
