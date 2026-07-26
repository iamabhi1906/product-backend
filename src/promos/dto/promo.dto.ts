import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsString, Length, Min } from 'class-validator';
import { PromoDiscountType } from '../enums/promo-discount-type.enum';

export class CreatePromoDto {
  @IsString()
  @Length(6, 6)
  code!: string;

  @IsEnum(PromoDiscountType)
  discountType!: PromoDiscountType;

  @Type(() => Number)
  @Min(0.01)
  discountValue!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxUses!: number;

  @IsDateString()
  expiresAt!: string;
}
