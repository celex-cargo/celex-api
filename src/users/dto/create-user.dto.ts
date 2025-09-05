import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../common/roles.enum';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  name?: string;

  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // مقدار پیش‌فرض در Schema/Service ست می‌شود
}

