import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.cart.findAll(request.user.sub);
  }

  @Post()
  add(@Req() request: AuthenticatedRequest, @Body() dto: AddCartItemDto) {
    return this.cart.add(request.user.sub, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cart.update(id, request.user.sub, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    await this.cart.remove(id, request.user.sub);
    return { message: 'Cart item deleted' };
  }

  @Delete()
  async clear(@Req() request: AuthenticatedRequest) {
    await this.cart.clear(request.user.sub);
    return { message: 'Cart cleared' };
  }
}
