import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';

export class UsersLogoutInputDto extends PickType(UsersBaseDto, [
  'id',
] as const) {}

export type UsersLogoutOutputDto = {
  readonly logout: boolean;
};
