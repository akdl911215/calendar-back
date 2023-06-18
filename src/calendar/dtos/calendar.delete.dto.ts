import { PickType } from '@nestjs/swagger';
import { CalendarDtoModel } from './calendar.dto.model';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class CalendarDeleteInputDto extends PickType(CalendarDtoModel, [
  'todo',
  'authorId',
] as const) {}

export class CalendarDeleteOutputDto extends BaseOutputDto<{
  readonly calendarErase: boolean;
}> {}
