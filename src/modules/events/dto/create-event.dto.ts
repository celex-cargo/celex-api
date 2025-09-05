import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString() awbNo: string;
  @IsIn(['RCS','DEP','ARR','NFD','DLV']) code: 'RCS'|'DEP'|'ARR'|'NFD'|'DLV';
  @IsString() location: string;   // IATA or station
  @IsDateString() utcTime: string;
  @IsOptional() @IsString() remarks?: string;
}
