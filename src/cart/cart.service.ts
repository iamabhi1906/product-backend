import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductStatus } from '../products/enums/product-status.enum';
import { Product } from '../products/entities/product.entity';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem) private readonly items: Repository<CartItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  async findAll(userId: string) {
    const items = await this.items.find({
      where: { userId: Number(userId) },
      order: { createdAt: 'DESC' },
    });
    const products = await this.products.findBy({
      id: In(items.map((item) => item.productId)),
    });
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );
    return items.flatMap((item) => {
      const product = productMap.get(item.productId);
      return product && product.status === ProductStatus.PUBLISHED
        ? [{ ...item, product }]
        : [];
    });
  }

  async add(userId: string, dto: AddCartItemDto) {
    const product = await this.products.findOneBy({
      id: dto.productId,
      status: ProductStatus.PUBLISHED,
    });
    if (!product) throw new NotFoundException('Product not found');
    if (dto.quantity > product.stock)
      throw new ForbiddenException('Requested quantity exceeds stock');
    const item = await this.items.findOneBy({
      userId: Number(userId),
      productId: dto.productId,
    });
    if (item) {
      if (item.quantity + dto.quantity > product.stock)
        throw new ForbiddenException('Requested quantity exceeds stock');
      item.quantity += dto.quantity;
      return this.items.save(item);
    }
    return this.items.save(
      this.items.create({ ...dto, userId: Number(userId) }),
    );
  }

  async update(id: string, userId: string, dto: UpdateCartItemDto) {
    const item = await this.getOwned(id, userId);
    const product = await this.products.findOneBy({
      id: item.productId,
      status: ProductStatus.PUBLISHED,
    });
    if (!product) throw new NotFoundException('Product is no longer available');
    if (dto.quantity > product.stock)
      throw new ForbiddenException('Requested quantity exceeds stock');
    item.quantity = dto.quantity;
    return this.items.save(item);
  }

  async remove(id: string, userId: string) {
    await this.items.remove(await this.getOwned(id, userId));
  }

  async clear(userId: string) {
    await this.items.delete({ userId: Number(userId) });
  }

  private async getOwned(id: string, userId: string) {
    const item = await this.items.findOneBy({ id: Number(id) });
    if (!item) throw new NotFoundException('Cart item not found');
    if (item.userId !== Number(userId))
      throw new ForbiddenException('Cart item does not belong to you');
    return item;
  }
}
