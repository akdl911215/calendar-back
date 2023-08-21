import { PickType } from '@nestjs/swagger';
import { UsersBaseDto } from './users.base.dto';

export class UsersRefreshTokenReIssuanceInputDto extends PickType(
  UsersBaseDto,
  ['appId', 'phone', 'id'] as const,
) {}

export class UsersRefreshTokenReIssuanceOutputDto {
  readonly id: string;
  readonly app_id: string;
  readonly phone: string;
  readonly access_token: string | null;
  readonly refresh_token: string | null;
}
