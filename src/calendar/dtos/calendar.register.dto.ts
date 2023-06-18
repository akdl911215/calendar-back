import { PickType } from '@nestjs/swagger';
import { CalendarDtoModel } from './calendar.dto.model';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Calendar } from '@prisma/client';

export class CalendarRegisterInputDto extends PickType(CalendarDtoModel, [
  'todo',
  'authorId',
  'date',
  'month',
  'day',
] as const) {}

export class CalendarRegisterOutputDto extends BaseOutputDto<Calendar> {}
