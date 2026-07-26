import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PromoDiscountType } from '../enums/promo-discount-type.enum';

@Entity('promos')
export class Promo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'enum', enum: PromoDiscountType })
  discountType!: PromoDiscountType;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  discountValue!: number;

  @Column({ type: 'integer' })
  maxUses!: number;

  @Column({ type: 'integer', default: 0 })
  usedTimes!: number;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
