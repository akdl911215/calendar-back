import {
  UsersRefreshReIssuanceEntityInputType,
  UsersRefreshReIssuanceEntityOutputType,
} from '../entites/users.entity.interface.type';

export interface UsersRefreshTokenReIssuanceInterface {
  readonly refresh: (
    entity: UsersRefreshReIssuanceEntityInputType,
  ) => Promise<UsersRefreshReIssuanceEntityOutputType>;
}
