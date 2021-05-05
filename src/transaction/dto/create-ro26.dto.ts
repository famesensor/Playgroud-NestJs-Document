import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class RO26Dto {
  @Type(() => SubjectDto)
  @ValidateNested({ each: true })
  subject: Array<SubjectDto>;
}

export class SubjectDto {
  @IsNotEmpty()
  @IsString()
  course_code: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  group_number: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  credit: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}
