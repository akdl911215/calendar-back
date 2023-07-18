import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Calendar } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { CalendarBaseDto } from './calendar.base.dto';

export class CalendarListInputDto extends PickType(CalendarBaseDto, [
  'month',
  'authorId',
] as const) {}

export class CalendarListBodyInputDto extends PickType(CalendarListInputDto, [
  'month',
] as const) {}

export class CalendarListOutputDto extends BaseOutputDto<{
  readonly monthList: Calendar[];
}> {}
