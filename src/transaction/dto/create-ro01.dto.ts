import { IsNotEmpty, IsString } from 'class-validator';
export class RO01Dto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  to_name: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
