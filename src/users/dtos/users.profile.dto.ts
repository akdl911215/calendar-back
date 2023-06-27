import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Users } from '@prisma/client';

export class UsersProfileInputDto extends PickType(UsersBaseDto, [
  'id',
] as const) {}

export class UsersProfileOutputDto extends BaseOutputDto<Users> {}
