import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsString()
  @IsOptional()
  filter_type: string;

  @IsString()
  @IsOptional()
  order: string; // acs, desc

  @IsString()
  @IsOptional()
  sort: string; // column name, std_id
}

export interface PaginationRes {
  status: boolean;
  page: number;
  total_page: number;
  data: any[];
}
