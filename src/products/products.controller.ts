import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { type Product } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(): Product[] {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: string): Product {
    return this.productsService.getProduct(id);
  }

  @Post()
  createProduct(@Body() payload: CreateProductDTO): Product {
    return this.productsService.createProduct(payload);
  }

  @Put(':id')
  updateProduct(
    @Body() payload: UpdateProductDTO,
    @Param('id') id: string,
  ): Product {
    return this.productsService.updateProduct(id, payload);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    this.productsService.deleteProduct(id);
    return `Product with id:${id} deleted successfully`;
  }
}
