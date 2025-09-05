import { IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QuoteDimDto {
  @IsNumber() @Min(0) l: number;
  @IsNumber() @Min(0) w: number;
  @IsNumber() @Min(0) h: number;
  @IsNumber() @Min(1) pcs: number;
}

export class CreateQuoteDto {
  @IsString() origin: string;
  @IsString() dest: string;
  @IsNumber() @Min(0) grossKg: number;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => QuoteDimDto) dims?: QuoteDimDto[];
}
