import {
  UsersRefreshTokenReIssuanceInputDto,
  UsersRefreshTokenReIssuanceOutputDto,
} from '../dtos/user.refresh.token.re.issuance.dto';

export interface UsersRefreshTokenReIssuanceDtoInterface {
  readonly refresh: (
    dto: UsersRefreshTokenReIssuanceInputDto,
  ) => Promise<UsersRefreshTokenReIssuanceOutputDto>;
}
