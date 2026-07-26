import { IsArray, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDto {
  @IsArray()
  productIds!: number[];

  @IsOptional()
  @IsString()
  @MaxLength(32)
  promoCode?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
