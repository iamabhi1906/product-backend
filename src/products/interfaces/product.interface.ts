import { ProductStatus } from '../enums/product-status.enum';

export interface Product {
  id: string;

  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  productImages: string[];

  status: ProductStatus;

  ownerId: string;

  createdAt: Date;
  updatedAt: Date;
}
