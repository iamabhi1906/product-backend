import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
  ) {}

  findByProduct(productId: string) { return this.reviews.find({ where: { productId: Number(productId) }, order: { createdAt: 'DESC' } }); }

  async create(userId: string, dto: CreateReviewDto) {
    const order = await this.orders.findOneBy({ id: dto.orderId, buyerId: Number(userId), productId: dto.productId });
    if (!order) throw new NotFoundException('Order item not found');
    if (order.status !== OrderStatus.DELIVERED) throw new ForbiddenException('Reviews can only be added after delivery');
    if (await this.reviews.existsBy({ orderId: dto.orderId, userId: Number(userId) })) throw new ConflictException('You have already reviewed this order item');
    return this.reviews.save(this.reviews.create({ ...dto, userId: Number(userId), media: dto.media ?? [] }));
  }
}
