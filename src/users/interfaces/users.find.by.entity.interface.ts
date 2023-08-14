import {
  UsersFindByAppIdInputType,
  UsersFindByAppIdOutputType,
  UsersFindByEmailInputType,
  UsersFindByEmailOutputType,
  UsersFindByIdInputType,
  UsersFindByIdOutputType,
  UsersFindByNicknameInputType,
  UsersFindByNicknameOutputType,
  UsersFindByPhoneInputType,
  UsersFindByPhoneOutputType,
} from '../entites/users.find.by.entity.interface.type';

export interface UsersFindByEntityInterface {
  readonly userFindById: (
    entity: UsersFindByIdInputType,
  ) => Promise<UsersFindByIdOutputType>;

  readonly usersFindByAppId: (
    entity: UsersFindByAppIdInputType,
  ) => Promise<UsersFindByAppIdOutputType>;

  readonly usersFindByNickname: (
    entity: UsersFindByNicknameInputType,
  ) => Promise<UsersFindByNicknameOutputType>;

  readonly usersFindByPhone: (
    entity: UsersFindByPhoneInputType,
  ) => Promise<UsersFindByPhoneOutputType>;

  readonly usersFindByEmail: (
    entity: UsersFindByEmailInputType,
  ) => Promise<UsersFindByEmailOutputType>;
}
