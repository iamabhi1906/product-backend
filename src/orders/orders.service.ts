import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CartItem } from '../cart/entities/cart-item.entity';
import { ProductStatus } from '../products/enums/product-status.enum';
import { Product } from '../products/entities/product.entity';
import { Promo } from '../promos/entities/promo.entity';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(CartItem) private readonly cart: Repository<CartItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Promo) private readonly promos: Repository<Promo>,
  ) {}

  findBuyerOrders(userId: string) { return this.orders.find({ where: { buyerId: Number(userId) }, relations: { vendor: true }, order: { placedAt: 'DESC' } }); }

  findVendorOrders(userId: string) { return this.orders.find({ where: { vendorId: Number(userId) }, relations: { buyer: true }, order: { placedAt: 'DESC' } }); }

  async create(userId: string, dto: CreateOrderDto) {
    return this.orders.manager.transaction(async (manager) => {
      const cartItems = await manager.find(CartItem, { where: { userId: Number(userId), productId: In(dto.productIds) }, lock: { mode: 'pessimistic_write' } });
      if (!cartItems.length || cartItems.length !== new Set(dto.productIds).size) throw new NotFoundException('One or more cart items were not found');
      const products = await manager.find(Product, { where: { id: In(cartItems.map((item) => item.productId)), status: ProductStatus.PUBLISHED }, lock: { mode: 'pessimistic_write' } });
      if (products.length !== cartItems.length) throw new NotFoundException('One or more products are unavailable');
      const productMap = new Map(products.map((product) => [product.id, product]));
      for (const item of cartItems) if (item.quantity > productMap.get(item.productId)!.stock) throw new ForbiddenException('Insufficient stock');
      const subtotal = cartItems.reduce((sum, item) => sum + Number(productMap.get(item.productId)!.price) * item.quantity, 0);
      const promo = dto.promoCode ? await this.getPromo(manager, dto.promoCode) : null;
      const discount = promo ? Math.min(promo.discountType === 'percentage' ? subtotal * Number(promo.discountValue) / 100 : Number(promo.discountValue), subtotal) : 0;
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const orders = cartItems.map((item) => {
        const product = productMap.get(item.productId)!;
        product.stock -= item.quantity;
        const share = Number((discount * (Number(product.price) * item.quantity / subtotal)).toFixed(2));
        return manager.create(Order, { orderNumber, buyerId: Number(userId), vendorId: product.userId, productId: product.id, productTitle: product.title, productPrice: product.price, productImages: product.productImages, quantity: item.quantity, discount: share });
      });
      await manager.save(products);
      if (promo) { promo.usedTimes += 1; promo.isActive = promo.usedTimes < promo.maxUses; await manager.save(promo); }
      await manager.delete(CartItem, { id: In(cartItems.map((item) => item.id)) });
      return manager.save(orders);
    });
  }

  async updateStatus(id: string, userId: string, status: OrderStatus) {
    const order = await this.orders.findOneBy({ id: Number(id) });
    if (!order) throw new NotFoundException('Order not found');
    if (order.vendorId !== Number(userId)) throw new ForbiddenException('Only the vendor can update this order');
    order.status = status;
    return this.orders.save(order);
  }

  private async getPromo(manager: Repository<Order>['manager'], code: string) {
    const promo = await manager.findOne(Promo, { where: { code: code.trim().toUpperCase() }, lock: { mode: 'pessimistic_write' } });
    if (!promo || !promo.isActive || promo.expiresAt <= new Date() || promo.usedTimes >= promo.maxUses) throw new NotFoundException('Promo code is not available');
    return promo;
  }
}
