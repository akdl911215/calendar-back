import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { CalendarUsers } from '@prisma/client';

export class UsersProfileInputDto extends PickType(UsersBaseDto, [
  'id',
] as const) {}

export class UsersProfileOutputDto extends BaseOutputDto<CalendarUsers> {}
