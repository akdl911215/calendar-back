import { PartialType } from '@nestjs/swagger';
import { UsersDtoModel } from './users.dto.model';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Users } from '@prisma/client';

export class UsersUpdateInputDto extends PartialType(UsersDtoModel) {}

export class UsersUpdateOutputDto extends BaseOutputDto<Users> {}
