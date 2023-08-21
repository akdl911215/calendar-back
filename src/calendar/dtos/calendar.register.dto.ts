import { PickType } from '@nestjs/swagger';
import { CalendarBaseDto } from './calendar.base.dto';
import { Calendar } from '@prisma/client';

export class CalendarRegisterInputDto extends PickType(CalendarBaseDto, [
  'todo',
  'authorId',
  'month',
  'day',
] as const) {}

export class CalendarRegisterBodyInputDto extends PickType(
  CalendarRegisterInputDto,
  ['todo', 'month', 'day'] as const,
) {}

export type CalendarRegisterOutputDto = Calendar;
