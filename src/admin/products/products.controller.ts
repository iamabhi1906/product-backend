import { Roles } from '@/src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/src/auth/guards/jwt.guard';
import { RolesGuard } from '@/src/auth/guards/role.guard';
import { ProductsService } from '@/src/products/products.service';
import { UserRole } from '@/src/users/enums/user-role.enum';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getProduct(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteProduct(@Param('id') id: string) {
    return this.productService.adminDeleteProduct(id);
  }
}
