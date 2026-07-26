import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderNumber!: string;

  @Column()
  buyerId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyerId' })
  buyer!: User;

  @Column()
  vendorId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'vendorId' })
  vendor!: User;

  @Column()
  productId!: number;

  @Column()
  productTitle!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  productPrice!: number;

  @Column('simple-array')
  productImages!: string[];

  @Column({ type: 'integer' })
  quantity!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  discount!: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  status!: OrderStatus;

  @Column({ default: 'paid' })
  paymentStatus!: string;

  @CreateDateColumn()
  placedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
