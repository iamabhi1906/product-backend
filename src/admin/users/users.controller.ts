import { Roles } from '@/src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/src/auth/guards/jwt.guard';
import { RolesGuard } from '@/src/auth/guards/role.guard';
import { UserRole } from '@/src/users/enums/user-role.enum';
import { UsersService } from '@/src/users/users.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/block-toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  toggleBlockUser(@Param('id') id: string) {
    return this.usersService.toggleBlockUser(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
