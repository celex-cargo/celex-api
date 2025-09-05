import { IsInt, IsMongoId, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId() quoteId: string;
  @IsObject() shipper: { name: string };
  @IsObject() consignee: { name: string };
  @IsInt() @Min(1) pieces: number;
  @IsInt() @Min(0) grossKg: number;
  @IsOptional() @IsString() remarks?: string;
}
