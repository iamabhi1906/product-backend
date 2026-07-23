import {
  IsInt,
  IsString,
  MinLength,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  IsUrl,
  Matches,
  Max,
  IsOptional,
} from 'class-validator';
import { ProductStatus } from '../interfaces/product.interface';

export class UpdateProductDTO {
  @IsOptional()
  @IsString({ message: 'Name must be a text string.' })
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a text string.' })
  @MinLength(10, {
    message: 'Description must be at least 10 characters long.',
  })
  @Matches(/^[a-zA-Z0-9\s.,!?-]+$/, {
    message:
      'Description contains invalid characters. Only alphanumeric text and basic punctuation are allowed.',
  })
  description!: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a valid number.' })
  @Min(1, { message: 'Price must be greater than zero.' })
  @Max(100000, { message: 'Price cannot exceed 1,00,000.' })
  price!: number;

  @IsOptional()
  @IsInt({ message: 'Stock must be a whole integer.' })
  @Min(5, { message: 'Stock must be at least 5.' })
  stock!: number;

  @IsOptional()
  @IsArray({ message: 'Product images must be provided as a list (array).' })
  @IsUrl(
    {},
    { each: true, message: 'Each product image must be a valid URL string.' },
  )
  productImages!: string[];

  @IsOptional()
  @IsEnum(ProductStatus, {
    message: `Status must be one of the following valid options: ${Object.values(ProductStatus).join(', ')}`,
  })
  status!: ProductStatus;
}
