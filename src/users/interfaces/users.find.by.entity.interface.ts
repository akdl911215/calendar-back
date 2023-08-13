import {
  UsersFindByIdInputType,
  UsersFindByIdOutputType,
} from '../entites/users.entity.interface.type';

export interface UsersFindByEntityInterface {
  readonly usersFindById: (
    entity: UsersFindByIdInputType,
  ) => Promise<UsersFindByIdOutputType>;
}
