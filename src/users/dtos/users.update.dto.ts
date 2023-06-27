import { PartialType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Users } from '@prisma/client';

export class UsersUpdateInputDto extends PartialType(UsersBaseDto) {}

export class UsersUpdateOutputDto extends BaseOutputDto<Users> {}
