import { Users } from '@prisma/client';
import { BaseOffsetPaginationOutputDto } from '../../_common/dtos/base.pagination.dto';
import {
  UsersCreateEntityInputType,
  UsersCreateEntityOutputType,
  UsersDeleteEntityInputType,
  UsersDeleteEntityOutputType,
  UsersListEntityInputType,
  UsersListEntityOutputType,
  UsersLoginEntityInputType,
  UsersLoginEntityOutputType,
  UsersLogoutEntityInputType,
  UsersLogoutEntityOutputType,
  UsersProfileEntityInputType,
  UsersProfileEntityOutputType,
  UsersUpdateEntityInputType,
  UsersUpdateEntityOutputType,
} from '../entites/users.entity.interface.type';

export interface UsersEntityInterface {
  readonly create: (
    entity: UsersCreateEntityInputType,
  ) => Promise<UsersCreateEntityOutputType>;

  readonly delete: (
    entity: UsersDeleteEntityInputType,
  ) => Promise<UsersDeleteEntityOutputType>;

  readonly list: (
    entity: UsersListEntityInputType,
  ) => Promise<UsersListEntityOutputType>;

  readonly update: (
    entity: UsersUpdateEntityInputType,
  ) => Promise<UsersUpdateEntityOutputType>;

  readonly login: (
    entity: UsersLoginEntityInputType,
  ) => Promise<UsersLoginEntityOutputType>;

  readonly logout: (
    entity: UsersLogoutEntityInputType,
  ) => Promise<UsersLogoutEntityOutputType>;

  readonly profile: (
    entity: UsersProfileEntityInputType,
  ) => Promise<UsersProfileEntityOutputType>;
}
