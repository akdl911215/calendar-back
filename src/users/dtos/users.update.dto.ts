import { PickType } from '@nestjs/swagger';
import { CalendarUsers } from '@prisma/client';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { UsersBaseDto } from './users.base.dto';

export class UsersUpdateNicknameInputDto extends PickType(UsersBaseDto, [
  'id',
  'nickname',
] as const) {}

export class UsersUpdateNicknameOutputDto extends BaseOutputDto<CalendarUsers> {}

export class UsersUpdatePhoneInputDto extends PickType(UsersBaseDto, [
  'id',
  'phone',
] as const) {}

export class UsersUpdatePhoneOutputDto extends BaseOutputDto<CalendarUsers> {}

export class UsersUpdateEmailInputDto extends PickType(UsersBaseDto, [
  'id',
  'email',
] as const) {}

export class UsersUpdateEmailOutputDto extends BaseOutputDto<CalendarUsers> {}

export class UsersReIssuancePasswordInputDto extends PickType(UsersBaseDto, [
  'id',
  'password',
] as const) {}

export class UsersReIssuancePasswordOutputDto extends BaseOutputDto<CalendarUsers> {}
