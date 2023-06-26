import { PickType } from '@nestjs/swagger';
import { UsersDtoModel } from './users.dto.model';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Users } from '@prisma/client';

export class UsersDeleteInputDto extends PickType(UsersDtoModel, [
  'id',
] as const) {}

export class UsersDeleteOutputDto extends BaseOutputDto<Users> {}
