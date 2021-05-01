import { IsEmpty, IsString } from 'class-validator';
export class RO01Dto {
  @IsEmpty()
  @IsString()
  title: string;

  @IsEmpty()
  @IsString()
  to_name: string;

  @IsEmpty()
  @IsString()
  reason: string;
}
