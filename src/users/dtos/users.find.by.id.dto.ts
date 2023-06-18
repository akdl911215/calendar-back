import { PickType } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { UsersDtoModel } from './users.dto.model';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersFindByIdInputDto extends PickType(UsersDtoModel, ['id']) {}

export class UsersFindByIdOutputDto extends BaseOutputDto<Users> {}
