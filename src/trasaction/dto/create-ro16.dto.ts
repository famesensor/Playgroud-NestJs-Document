import { IsEmpty, IsNumber, IsString } from 'class-validator';

export class ro16Dto {
  @IsEmpty()
  @IsString()
  to_name: string;

  @IsEmpty()
  @IsString()
  attach_one: string;

  @IsEmpty()
  @IsString()
  attach_two: string;

  @IsEmpty()
  @IsString()
  wish: string;

  @IsEmpty()
  @IsNumber()
  time_period: number;

  @IsEmpty()
  @IsString()
  start_date: string;

  @IsEmpty()
  @IsString()
  end_date: string;
}
