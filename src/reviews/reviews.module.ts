import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Order } from '../orders/entities/order.entity';
import { Review } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({ imports: [AuthModule, TypeOrmModule.forFeature([Review, Order])], controllers: [ReviewsController], providers: [ReviewsService] })
export class ReviewsModule {}
