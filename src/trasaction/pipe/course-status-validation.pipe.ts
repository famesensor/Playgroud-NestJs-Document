import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { CourseStatus } from '../enum/trasaction.enum';

export class CourseTypeValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    CourseStatus.ADD_SUBJECT,
    CourseStatus.CHANGE_COURSE,
    CourseStatus.CHANGE_SECTION,
    CourseStatus.CHANGE_SECTION,
    CourseStatus.WITHDRAWAL,
  ];

  async transform(value: any, _: ArgumentMetadata) {
    if (value['subject'].length == 0) {
      throw new BadRequestException({ message: 'course is requirement' });
    }
    if (value['subject'] instanceof Array && value['subject'].length != 0) {
      value['subject'].forEach((item) => {
        const type = item.type.toUpperCase();
        if (!this.isStatusValid(type)) {
          throw new BadRequestException(`${item.type} is am invalid type`);
        }
      });

      return value;
    }
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatus.indexOf(status);
    return idx !== -1;
  }
}
