import { ApiProperty, PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Users } from '@prisma/client';

export class UsersCreateInputDto extends PickType(UsersBaseDto, [
  'appId',
  'nickname',
  'password',
  'phone',
] as const) {
  @ApiProperty({
    type: String,
    required: true,
    format: 'password',
    description: '비밀번호 확인',
  })
  public confirmPassword?: string;
}

export class UsersCreateOutputDto extends BaseOutputDto<Users> {}
