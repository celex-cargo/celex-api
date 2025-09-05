import { IsArray, IsDateString, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCapacityDto {
  @IsString() flightNo: string;
  @IsString() origin: string; // IATA
  @IsString() dest: string;   // IATA
  @IsDateString() etdUtc: string;
  @IsDateString() etaUtc: string;
  @IsInt() @Min(0) payloadKg: number;
  @IsArray() @IsString({ each: true }) uldTypes: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) commoditiesAllowed?: string[];
  @IsOptional() @IsIn(['PUBLISHED','DRAFT','CLOSED']) status?: 'PUBLISHED'|'DRAFT'|'CLOSED' = 'PUBLISHED';
}
