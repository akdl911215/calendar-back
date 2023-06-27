import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersLogoutInputDto extends PickType(UsersBaseDto, [
  'id',
] as const) {}

export class UsersLogoutOutputDto extends BaseOutputDto<{
  readonly logout: boolean;
}> {}
