import { PickType } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { UsersBaseDto } from './users.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersFindByIdInputDto extends PickType(UsersBaseDto, ['id']) {}

export class UsersFindByIdOutputDto extends BaseOutputDto<Users> {}
