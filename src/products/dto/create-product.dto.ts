import {
  IsInt,
  IsString,
  MinLength,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  IsUrl,
  IsEmail,
  Matches,
  Max,
} from 'class-validator';
import {
  ProductCategory,
  ProductStatus,
} from '../interfaces/product.interface';

export class CreateProductDTO {
  @IsString({ message: 'Name must be a text string.' })
  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  name!: string;

  @IsString({ message: 'Description must be a text string.' })
  @MinLength(10, {
    message: 'Description must be at least 10 characters long.',
  })
  @Matches(/^[a-zA-Z0-9\s.,!?-]+$/, {
    message:
      'Description contains invalid characters. Only alphanumeric text and basic punctuation are allowed.',
  })
  description!: string;

  @IsNumber({}, { message: 'Price must be a valid number.' })
  @Min(1, { message: 'Price must be greater than zero.' })
  @Max(100000, { message: 'Price cannot exceed 1,00,000.' })
  price!: number;

  @IsInt({ message: 'Stock must be a whole integer.' })
  @Min(5, { message: 'Stock must be at least 5.' })
  stock!: number;

  @IsEnum(ProductCategory, {
    message: `Category must be one of the following valid options: ${Object.values(ProductCategory).join(', ')}`,
  })
  category!: ProductCategory;

  @IsArray({ message: 'Product images must be provided as a list (array).' })
  @IsUrl(
    {},
    { each: true, message: 'Each product image must be a valid URL string.' },
  )
  productImages!: string[];

  @IsEnum(ProductStatus, {
    message: `Status must be one of the following valid options: ${Object.values(ProductStatus).join(', ')}`,
  })
  status!: ProductStatus;

  @IsEmail(
    {},
    {
      message:
        'Vendor email must be a valid email address structure (e.g., user@domain.com).',
    },
  )
  vendorEmail!: string;

  @IsString({ message: 'Vendor name must be a text string.' })
  @MinLength(2, { message: 'Vendor name must be at least 2 characters long.' })
  @Matches(/^[a-zA-Z\s.-]+$/, {
    message:
      'Vendor name can only contain letters, spaces, hyphens, and periods.',
  })
  vendorName!: string;
}
