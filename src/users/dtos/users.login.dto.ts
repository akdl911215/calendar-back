import { UsersBaseDto } from './users.base.dto';
import { PickType } from '@nestjs/swagger';

export class UsersLoginInputDto extends PickType(UsersBaseDto, [
  'appId',
  'password',
] as const) {}

export type UsersLoginOutputDto = {
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
};
