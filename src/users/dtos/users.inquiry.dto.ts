import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Users } from '@prisma/client';

export class UsersInquiryInputDto extends PickType(UsersBaseDto, [
  'id',
] as const) {}

export class UsersInquiryOutputDto extends BaseOutputDto<Users> {}
