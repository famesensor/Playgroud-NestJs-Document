import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RO16Dto {
  @IsNotEmpty()
  @IsString()
  to_name: string;

  @IsNotEmpty()
  @IsString()
  attach_one: string;

  @IsNotEmpty()
  @IsString()
  attach_two: string;

  @IsNotEmpty()
  @IsString()
  wish: string;

  @IsNotEmpty()
  @IsNumber()
  time_period: number;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;
}
