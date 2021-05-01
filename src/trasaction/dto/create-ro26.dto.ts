import { Type } from 'class-transformer';
import {
  IsEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class RO26Dto {
  @Type(() => SubjectDto)
  @MaxLength(8)
  @ValidateNested({ each: true })
  subject: Array<SubjectDto>;
}

export class SubjectDto {
  @IsEmpty()
  @IsString()
  course_code: string;

  @IsEmpty()
  @IsNumber()
  @Min(1)
  group_number: number;

  @IsEmpty()
  @IsNumber()
  @Min(1)
  credit: number;

  @IsEmpty()
  @IsString()
  type: string;
}
