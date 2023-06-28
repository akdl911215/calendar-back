import { UsersBaseDto } from './users.base.dto';
import { PickType } from '@nestjs/swagger';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersLoginInputDto extends PickType(UsersBaseDto, [
  'appId',
  'password',
] as const) {}

export class UsersLoginOutputDto extends BaseOutputDto<{
  readonly id: string;
  readonly appId: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
  readonly refreshToken: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;
  readonly accessToken: string | null;
}> {}
