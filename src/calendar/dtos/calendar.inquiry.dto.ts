import { PickType } from '@nestjs/swagger';
import { Calendar } from '@prisma/client';
import { CalendarBaseDto } from './calendar.base.dto';

export class CalendarInquiryInputDto extends PickType(CalendarBaseDto, [
  'month',
  'day',
  'authorId',
] as const) {}

export type CalendarInquiryOutputDto = {
  readonly inquiryList: Calendar[];
};
