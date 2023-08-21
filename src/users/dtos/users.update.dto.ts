import { PickType } from '@nestjs/swagger';
import { CalendarUsers } from '@prisma/client';
import { UsersBaseDto } from './users.base.dto';

export class UsersUpdateNicknameInputDto extends PickType(UsersBaseDto, [
  'id',
  'nickname',
] as const) {}

export class UsersUpdateNicknameInputDateDto extends PickType(
  UsersUpdateNicknameInputDto,
  ['nickname'] as const,
) {}

export type UsersUpdateNicknameOutputDto = CalendarUsers;

export class UsersUpdatePhoneInputDto extends PickType(UsersBaseDto, [
  'id',
  'phone',
] as const) {}

export type UsersUpdatePhoneOutputDto = CalendarUsers;

export class UsersUpdateEmailInputDto extends PickType(UsersBaseDto, [
  'id',
  'email',
] as const) {}

export type UsersUpdateEmailOutputDto = CalendarUsers;

export class UsersReIssuancePasswordInputDto extends PickType(UsersBaseDto, [
  'id',
  'password',
] as const) {}

export type UsersReIssuancePasswordOutputDto = CalendarUsers;
