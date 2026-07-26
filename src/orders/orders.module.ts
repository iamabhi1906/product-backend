import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { Promo } from '../promos/entities/promo.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({ imports: [AuthModule, TypeOrmModule.forFeature([Order, CartItem, Product, Promo])], controllers: [OrdersController], providers: [OrdersService] })
export class OrdersModule {}
