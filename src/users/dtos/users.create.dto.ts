import { ApiProperty, PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { CalendarUsers } from '@prisma/client';

export class UsersCreateInputDto extends PickType(UsersBaseDto, [
  'appId',
  'nickname',
  'password',
  'phone',
  'email',
] as const) {
  @ApiProperty({
    type: String,
    required: true,
    format: 'password',
    description: '비밀번호 확인',
  })
  public confirmPassword?: string;
}

export type UsersCreateOutputDto = CalendarUsers;
