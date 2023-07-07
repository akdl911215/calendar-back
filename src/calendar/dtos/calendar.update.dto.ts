import { ApiProperty, PickType } from '@nestjs/swagger';
import { CalendarBaseDto } from './calendar.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Calendar } from '@prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

class calendarUpdateInputDtoModel extends PickType(CalendarBaseDto, [
  'authorId',
  'id',
  'month',
  'day',
] as const) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
    description: '할일 완료 유무',
    default: false,
  })
  public done?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    default: '',
    required: false,
    description: '할 일',
  })
  public todo?: string;
}

export class CalendarUpdateInputDto extends calendarUpdateInputDtoModel {}

export class CalendarUpdateOutputDto extends BaseOutputDto<Calendar> {}
