import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductStatus } from './enums/product-status.enum';

@Injectable()
export class ProductsService {
  protected products: Product[] = [];

  findAllPublished(): Product[] {
    return this.products.filter(
      (product) => product.status === ProductStatus.PUBLISHED,
    );
  }

  findMyProducts(ownerId: string): Product[] {
    return this.products.filter((product) => product.ownerId === ownerId);
  }

  findPublishedById(id: string): Product {
    const product = this.products.find(
      (product) =>
        product.id === id && product.status === ProductStatus.PUBLISHED,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  getProduct(id: string): Product {
    const product = this.products.find((product) => product.id === id);
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  createProduct(ownerId: string, createProductDto: CreateProductDTO): Product {
    const existingProduct = this.products.find(
      (product) => product.title === createProductDto.title,
    );
    if (existingProduct)
      throw new ConflictException(
        `Product with title ${createProductDto.title} already exists`,
      );
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...createProductDto,
      status: ProductStatus.DRAFT,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(
    id: string,
    ownerId: string,
    updateProductDto: UpdateProductDTO,
  ): Product {
    const product = this.getProduct(id);
    if (product.ownerId !== ownerId)
      throw new ForbiddenException(
        'You are not authorized to update this product',
      );

    if (updateProductDto?.title) {
      const existingProduct = this.products.find(
        (product) =>
          product.title === updateProductDto.title && product.id !== id,
      );
      if (existingProduct) {
        throw new ConflictException(
          `Product with title ${updateProductDto.title} already exists`,
        );
      }
    }

    const index = this.products.findIndex((product) => product.id === id);
    const updatedProduct: Product = {
      ...product,
      ...updateProductDto,
      updatedAt: new Date(),
    };
    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  updateProductStatus(
    id: string,
    ownerId: string,
    status: ProductStatus,
  ): Product {
    const product = this.getProduct(id);
    if (product.ownerId !== ownerId)
      throw new ForbiddenException(
        'You are not authorized to change the status of this product',
      );

    product.status = status;
    product.updatedAt = new Date();
    return product;
  }

  deleteProduct(id: string, ownerId: string): void {
    const product = this.getProduct(id);
    if (product.ownerId !== ownerId)
      throw new ForbiddenException(
        'You are not authorized to delete this product',
      );
    const index = this.products.findIndex((product) => product.id === id);

    this.products.splice(index, 1);
  }
}
