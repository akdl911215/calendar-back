import { PickType } from '@nestjs/swagger';
import { CalendarDtoModel } from './calendar.dto.model';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Calendar } from '@prisma/client';

export class CalendarInquiryInputDto extends PickType(CalendarDtoModel, [
  'date',
  'authorId',
] as const) {}

export class CalendarInquiryOutputDto extends BaseOutputDto<{
  readonly inquiryList: Calendar[];
}> {}
