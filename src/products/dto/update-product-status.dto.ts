import { IsEnum } from 'class-validator';
import { ProductStatus } from '../enums/product-status.enum';

export class UpdateProductStatusDTO {
  @IsEnum(ProductStatus, {
    message: 'Status must be DRAFT or PUBLISHED',
  })
  status!: ProductStatus;
}
