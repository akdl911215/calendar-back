import {
  UsersFindByAppIdInputType,
  UsersFindByAppIdOutputType,
  UsersFindByEmailInputType,
  UsersFindByEmailOutputType,
  UsersFindByIdInputType,
  UsersFindByIdOrEmailInputType,
  UsersFindByIdOrEmailOutputType,
  UsersFindByIdOrNicknameInputType,
  UsersFindByIdOrNicknameOutputType,
  UsersFindByIdOrPhoneInputType,
  UsersFindByIdOrPhoneOutputType,
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

  readonly usersFindByIdOrNickname: (
    entity: UsersFindByIdOrNicknameInputType,
  ) => Promise<UsersFindByIdOrNicknameOutputType>;

  readonly usersFindByIdOrPhone: (
    entity: UsersFindByIdOrPhoneInputType,
  ) => Promise<UsersFindByIdOrPhoneOutputType>;

  readonly usersFindByIdOrEmail: (
    entity: UsersFindByIdOrEmailInputType,
  ) => Promise<UsersFindByIdOrEmailOutputType>;
}
