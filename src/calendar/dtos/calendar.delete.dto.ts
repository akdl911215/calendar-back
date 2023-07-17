import { PickType } from '@nestjs/swagger';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { CalendarBaseDto } from './calendar.base.dto';

export class CalendarDeleteInputDto extends PickType(CalendarBaseDto, [
  'todo',
  'authorId',
] as const) {}

export class CalendarDeleteOutputDto extends BaseOutputDto<{
  readonly calendarErase: boolean;
}> {}
