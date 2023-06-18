import { PartialType } from '@nestjs/swagger';
import { CalendarDtoModel } from './calendar.dto.model';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Calendar } from '@prisma/client';

export class CalendarUpdateInputDto extends PartialType(CalendarDtoModel) {}

export class CalendarUpdateOutputDto extends BaseOutputDto<Calendar> {}
