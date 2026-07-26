import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserRole } from '../users/enums/user-role.enum';
import { CreatePromoDto } from './dto/promo.dto';
import { PromosService } from './promos.service';

@Controller('promos')
export class PromosController {
  constructor(private readonly promos: PromosService) {}

  @Get(':code')
  validate(@Param('code') code: string) { return this.promos.validate(code); }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() { return this.promos.findAll(); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreatePromoDto) { return this.promos.create(dto); }
}
