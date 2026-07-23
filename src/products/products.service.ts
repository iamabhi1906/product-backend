import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  protected products: Product[] = [];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProduct(id: string): Product {
    const product = this.products.find((product) => product.id === id);
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  createProduct(createProductDto: CreateProductDTO): Product {
    const existingProduct = this.products.find(
      (product) => product.name === createProductDto.name,
    );
    if (existingProduct)
      throw new ConflictException(
        `Product with name ${createProductDto.name} already exists`,
      );
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updateProductDto: UpdateProductDTO): Product {
    const product = this.getProduct(id);
    const cleanUpdateDto = Object.fromEntries(
      Object.entries(updateProductDto).filter(
        ([, value]) => value !== undefined,
      ),
    );
    const updatedProduct: Product = {
      ...product,
      ...cleanUpdateDto,
      updatedAt: new Date(),
    };
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1)
      throw new NotFoundException(`Product with id ${id} not found`);
    if (updateProductDto?.name) {
      const existingProduct = this.products.find(
        (product) => product.name === updateProductDto.name,
      );
      if (existingProduct)
        throw new ConflictException(
          `Product with name ${updateProductDto.name} already exists`,
        );
    }
    this.products[index] = updatedProduct;
    return this.products[index];
  }

  deleteProduct(id: string): void {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1)
      throw new NotFoundException(`Product with id ${id} not found`);
    this.products.splice(index, 1);
  }
}
