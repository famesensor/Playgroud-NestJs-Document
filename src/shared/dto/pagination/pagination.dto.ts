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
}

export interface PaginationRes {
  status: boolean;
  data: any[];
}
