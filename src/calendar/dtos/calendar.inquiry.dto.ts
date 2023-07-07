import { PickType } from '@nestjs/swagger';
import { CalendarBaseDto } from './calendar.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Calendar } from '@prisma/client';

export class CalendarInquiryInputDto extends PickType(CalendarBaseDto, [
  'month',
  'day',
  'authorId',
] as const) {}

export class CalendarInquiryOutputDto extends BaseOutputDto<{
  readonly inquiryList: Calendar[];
}> {}
