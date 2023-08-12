import { PickType } from '@nestjs/swagger';
import { CalendarUsers } from '@prisma/client';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { UsersBaseDto } from './users.base.dto';

export class UsersUpdateInputDto extends PickType(UsersBaseDto, [
  'id',
  'appId',
  'nickname',
  'password',
  'phone',
  'email',
] as const) {}

export class UsersUpdateOutputDto extends BaseOutputDto<CalendarUsers> {}
