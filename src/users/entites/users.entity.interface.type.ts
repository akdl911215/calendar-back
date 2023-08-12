import { CalendarUsers } from '@prisma/client';
import { BaseOffsetPaginationOutputDto } from '../../_common/dtos/base.pagination.dto';

export type UsersCreateEntityInputType = {
  readonly appId: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
  readonly email: string;
};

export type UsersCreateEntityOutputType = CalendarUsers;

export type UsersDeleteEntityInputType = { readonly id: string };

export type UsersDeleteEntityOutputType = CalendarUsers;

export type UsersListEntityInputType = {
  readonly page: number;
  readonly take: number;
};

export type UsersListEntityOutputType = BaseOffsetPaginationOutputDto<{
  readonly id: string;
  readonly appId: string;
  readonly phone: string;
  readonly nickname: string;
  readonly created_at: Date;
}>;

export type UsersUpdateEntityInputType = {
  readonly id: string;
  readonly appId: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
  readonly email: string;
};

export type UsersUpdateEntityOutputType = CalendarUsers;

export type UsersLoginEntityInputType = {
  readonly appId: string;
  readonly password: string;
};

export type UsersLoginEntityOutputType = {
  readonly id: string;
  readonly app_id: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
  readonly email: string;
  readonly created_at: Date;
  readonly updated_at: Date | null;
  readonly deleted_at: Date | null;
  readonly refresh_token: string | null;
  readonly access_token: string | null;
};

export type UsersLogoutEntityInputType = { readonly id: string };

export type UsersLogoutEntityOutputType = {
  readonly logout: boolean;
};

export type UsersProfileEntityInputType = { readonly id: string };

export type UsersProfileEntityOutputType = CalendarUsers;

export type UsersRefreshReIssuanceEntityInputType = {
  readonly id: string;
  readonly phone: string;
  readonly appId: string;
};

export type UsersRefreshReIssuanceEntityOutputType = {
  readonly id: string;
  readonly app_id: string;
  readonly phone: string;
  readonly access_token: string | null;
  readonly refresh_token: string | null;
};
