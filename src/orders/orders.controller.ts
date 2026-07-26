import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get('mine')
  findMine(@Req() request: AuthenticatedRequest) { return this.orders.findBuyerOrders(request.user.sub); }

  @Get('vendor')
  @UseGuards(RolesGuard)
  @Roles(UserRole.VENDOR)
  findVendor(@Req() request: AuthenticatedRequest) { return this.orders.findVendorOrders(request.user.sub); }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateOrderDto) { return this.orders.create(request.user.sub, dto); }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.VENDOR)
  updateStatus(@Param('id') id: string, @Req() request: AuthenticatedRequest, @Body() dto: UpdateOrderStatusDto) { return this.orders.updateStatus(id, request.user.sub, dto.status); }
}
