import { PickType } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { UsersBaseDto } from './users.base.dto';

export class UsersUpdateInputDto extends PickType(UsersBaseDto, [
  'id',
  'appId',
  'nickname',
  'password',
  'phone',
] as const) {}

export class UsersUpdateOutputDto extends BaseOutputDto<Users> {}
