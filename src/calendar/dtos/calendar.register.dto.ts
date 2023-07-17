import { PickType } from '@nestjs/swagger';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Calendar } from '@prisma/client';
import { CalendarBaseDto } from './calendar.base.dto';

export class CalendarRegisterInputDto extends PickType(CalendarBaseDto, [
  'todo',
  'authorId',
  'month',
  'day',
] as const) {}

export class CalendarRegisterOutputDto extends BaseOutputDto<Calendar> {}
