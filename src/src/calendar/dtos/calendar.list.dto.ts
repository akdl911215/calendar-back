import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Calendar } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { CalendarDtoModel } from './calendar.dto.model';

export class CalendarListInputDto extends PickType(CalendarDtoModel, [
  'month',
  'authorId',
] as const) {}

export class CalendarListOutputDto extends BaseOutputDto<{
  readonly monthList: Calendar[];
}> {}
