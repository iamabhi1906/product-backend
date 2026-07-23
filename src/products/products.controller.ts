import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { type Product } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { type AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { UpdateProductStatusDTO } from './dto/update-product-status.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createProduct(
    @Req() request: AuthenticatedRequest,
    @Body() payload: CreateProductDTO,
  ): Product {
    return this.productsService.createProduct(request.user.sub, payload);
  }

  @Get()
  findAllPublished() {
    return this.productsService.findAllPublished();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyProducts(@Req() request: AuthenticatedRequest) {
    return this.productsService.findMyProducts(request.user.sub);
  }

  @Get(':id')
  findPublishedById(@Param('id') id: string) {
    return this.productsService.findPublishedById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateProduct(
    @Req() request: AuthenticatedRequest,
    @Body() payload: UpdateProductDTO,
    @Param('id') id: string,
  ): Product {
    return this.productsService.updateProduct(id, request.user.sub, payload);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateProductStatus(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateProductStatusDTO,
  ) {
    return this.productsService.updateProductStatus(
      id,
      request.user.sub,
      dto.status,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    this.productsService.deleteProduct(id, request.user.sub);
    return {
      status: 'success',
      message: `Product with id:${id} deleted successfully`,
    };
  }
}
