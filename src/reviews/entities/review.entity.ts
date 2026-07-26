import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderId!: number;

  @Column()
  productId!: number;

  @Column()
  userId!: number;

  @Column({ type: 'integer' })
  rating!: number;

  @Column({ type: 'text' })
  comment!: string;

  @Column('simple-array', { default: '' })
  media!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
