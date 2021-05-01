import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  id: string;

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
  data: any[];
}
