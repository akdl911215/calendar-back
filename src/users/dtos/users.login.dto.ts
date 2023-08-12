import { UsersBaseDto } from './users.base.dto';
import { PickType } from '@nestjs/swagger';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersLoginInputDto extends PickType(UsersBaseDto, [
  'appId',
  'password',
] as const) {}

export class UsersLoginOutputDto extends BaseOutputDto<{
  readonly id: string;
  readonly app_id: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
  readonly email: string;
  readonly refresh_token: string | null;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date | null;
  readonly access_token: string | null;
}> {}
