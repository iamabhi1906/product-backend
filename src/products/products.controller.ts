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
  async createProduct(
    @Req() request: AuthenticatedRequest,
    @Body() payload: CreateProductDTO,
  ) {
    return await this.productsService.createProduct(request.user.sub, payload);
  }

  @Get()
  async findAllPublished() {
    return await this.productsService.findAllPublished();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMyProducts(@Req() request: AuthenticatedRequest) {
    return await this.productsService.findMyProducts(request.user.sub);
  }

  @Get(':id')
  async findPublishedById(@Param('id') id: string) {
    return await this.productsService.findPublishedById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Req() request: AuthenticatedRequest,
    @Body() payload: UpdateProductDTO,
    @Param('id') id: string,
  ) {
    return await this.productsService.updateProduct(
      id,
      request.user.sub,
      payload,
    );
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateProductStatus(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateProductStatusDTO,
  ) {
    return await this.productsService.updateProductStatus(
      id,
      request.user.sub,
      dto.status,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.productsService.deleteProduct(id, request.user.sub);
    return {
      status: 'success',
      message: `Product with id:${id} deleted successfully`,
    };
  }
}
