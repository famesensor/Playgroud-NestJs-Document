import { IsEmpty } from 'class-validator';

export class RO26Dto {
  subject: Array<Subject>;
}

class Subject {
  @IsEmpty()
  course_code: string;

  @IsEmpty()
  group_number: number;

  @IsEmpty()
  credit: number;

  @IsEmpty()
  type: string;
}
