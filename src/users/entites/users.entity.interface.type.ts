import { Users } from '@prisma/client';
import { BaseOffsetPaginationOutputDto } from '../../_common/dtos/base.pagination.dto';

export type UsersCreateEntityInputType = {
  readonly appId: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
};

export type UsersCreateEntityOutputType = Users;

export type UsersDeleteEntityInputType = { readonly id: string };

export type UsersDeleteEntityOutputType = Users;

export type UsersListEntityInputType = {
  readonly page: number;
  readonly take: number;
};

export type UsersListEntityOutputType = BaseOffsetPaginationOutputDto<{
  readonly id: string;
  readonly appId: string;
  readonly phone: string;
  readonly nickname: string;
  readonly createdAt: Date;
}>;

export type UsersUpdateEntityInputType = {
  readonly id: string;
  readonly appId: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
};

export type UsersUpdateEntityOutputType = Users;

export type UsersLoginEntityInputType = {
  readonly appId: string;
  readonly password: string;
};

export type UsersLoginEntityOutputType = {
  readonly id: string;
  readonly appId: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
  readonly refreshToken: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;
  readonly deletedAt: Date | null;
  readonly accessToken: string | null;
};

export type UsersLogoutEntityInputType = { readonly id: string };

export type UsersLogoutEntityOutputType = {
  readonly logout: boolean;
};

export type UsersProfileEntityInputType = { readonly id: string };

export type UsersProfileEntityOutputType = Users;
