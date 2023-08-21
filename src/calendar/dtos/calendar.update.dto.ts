import { ApiProperty, PickType } from '@nestjs/swagger';
import { Calendar } from '@prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CalendarBaseDto } from './calendar.base.dto';

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

export class CalendarUpdateBodyInputDto extends PickType(
  CalendarUpdateInputDto,
  ['todo', 'done', 'id', 'month', 'day'] as const,
) {}

export type CalendarUpdateOutputDto = Calendar;
