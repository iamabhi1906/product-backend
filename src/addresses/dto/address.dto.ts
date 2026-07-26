import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class AddressDto {
  @IsString()
  @MaxLength(100)
  city!: string;

  @IsString()
  @MaxLength(200)
  landmark!: string;

  @IsString()
  @MaxLength(100)
  state!: string;

  @IsInt()
  @Min(100000)
  pinCode!: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
