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
  UsersReIssuancePasswordEntityInputType,
  UsersReIssuancePasswordEntityOutputType,
  UsersUpdateEmailEntityInputType,
  UsersUpdateEmailEntityOutputType,
  UsersUpdateNicknameEntityInputType,
  UsersUpdateNicknameEntityOutputType,
  UsersUpdatePhoneEntityInputType,
  UsersUpdatePhoneEntityOutputType,
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

  readonly updateNickname: (
    entity: UsersUpdateNicknameEntityInputType,
  ) => Promise<UsersUpdateNicknameEntityOutputType>;

  readonly reIssuancePassword: (
    entity: UsersReIssuancePasswordEntityInputType,
  ) => Promise<UsersReIssuancePasswordEntityOutputType>;

  readonly updatePhone: (
    entity: UsersUpdatePhoneEntityInputType,
  ) => Promise<UsersUpdatePhoneEntityOutputType>;

  readonly updateEmail: (
    email: UsersUpdateEmailEntityInputType,
  ) => Promise<UsersUpdateEmailEntityOutputType>;

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
