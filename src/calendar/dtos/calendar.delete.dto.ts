import { PickType } from '@nestjs/swagger';
import { CalendarBaseDto } from './calendar.base.dto';
import { Calendar } from '@prisma/client';

export class CalendarDeleteInputDto extends PickType(CalendarBaseDto, [
  'todo',
  'authorId',
  'id',
] as const) {}

export class CalendarDeleteBodyInputDto extends PickType(
  CalendarDeleteInputDto,
  ['todo', 'id'] as const,
) {}

export type CalendarDeleteOutputDto = Calendar;
