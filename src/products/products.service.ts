import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductStatus } from './enums/product-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: Number(id) },
    });
    if (!product)
      throw new NotFoundException(`Product with id:${id} not found`);
    return product;
  }

  async findAllPublished(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { status: ProductStatus.PUBLISHED },
      relations: { user: true },
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        user: {
          name: true,
          email: true,
        },
      },
    });
  }

  async findPublishedById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: Number(id) },
      relations: { user: true },
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        user: {
          name: true,
          email: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findMyProducts(userId: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { userId: Number(userId) },
    });
  }

  async createProduct(
    userId: string,
    createProductDto: CreateProductDTO,
  ): Promise<Product> {
    const exists = await this.productRepository.existsBy({
      title: createProductDto.title,
      userId: Number(userId),
    });
    if (exists) {
      throw new ConflictException(
        `Product with title "${createProductDto.title}" already exists`,
      );
    }
    const product = this.productRepository.create({
      ...createProductDto,
      userId: Number(userId),
    });
    return await this.productRepository.save(product);
  }

  async updateProduct(
    id: string,
    userId: string,
    updateProductDto: UpdateProductDTO,
  ): Promise<Product> {
    if (updateProductDto?.title) {
      const existingProduct = await this.productRepository.find({
        where: { title: updateProductDto.title },
      });
      if (existingProduct.length > 0) {
        throw new ConflictException(
          `Product with title ${updateProductDto.title} already exists`,
        );
      }
    }
    const product = await this.getProductById(id);
    if (product.userId !== Number(userId))
      throw new UnauthorizedException(
        'You are not allowed to update this product',
      );
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async updateProductStatus(
    id: string,
    userId: string,
    status: ProductStatus,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    if (product.userId !== Number(userId))
      throw new ForbiddenException(
        'You are not authorized to change the status of this product',
      );

    product.status = status;
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string, userId: string) {
    const product = await this.getProductById(id);
    if (product.userId !== Number(userId))
      throw new ForbiddenException(
        'You are not authorized to delete this product',
      );
    return this.productRepository.remove(product);
  }

  async adminDeleteProduct(id: string) {
    const product = await this.getProductById(id);
    if (product) throw new NotFoundException(`Product with id:${id} not found`);
    return this.productRepository.remove(product);
  }
}
