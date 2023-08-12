import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersRefreshTokenReIssuanceInputDto extends PickType(
  UsersBaseDto,
  ['appId', 'phone', 'id'] as const,
) {}

export class UsersRefreshTokenReIssuanceOutputDto extends BaseOutputDto<{
  readonly id: string;
  readonly app_id: string;
  readonly phone: string;
  readonly access_token: string | null;
  readonly refresh_token: string | null;
}> {}
