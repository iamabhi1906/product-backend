import { IsArray, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  orderId!: number;

  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @MaxLength(1000)
  comment!: string;

  @IsOptional()
  @IsArray()
  media?: string[];
}
