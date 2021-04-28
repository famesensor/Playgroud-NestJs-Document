import { IsEmpty, IsString } from 'class-validator';

export class ro01Dto {
  @IsEmpty()
  @IsString()
  title: string;

  @IsEmpty()
  @IsString()
  to_name: string;
}
