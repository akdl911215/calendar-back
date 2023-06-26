import { PickType } from '@nestjs/swagger';
import { UsersDtoModel } from './users.dto.model';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Users } from '@prisma/client';

export class UsersCreateInputDto extends PickType(UsersDtoModel, [
  'appId',
  'nickname',
  'password',
  'phone',
] as const) {}

export class UsersCreateOutputDto extends BaseOutputDto<Users> {}
