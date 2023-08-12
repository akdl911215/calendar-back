import {
  UsersFindByIdInputType,
  UsersFindByIdOutputType,
} from '../dtos/users.find.by.id.dto';

export interface UsersFindByEntityInterface {
  readonly usersFindById: (
    entity: UsersFindByIdInputType,
  ) => Promise<UsersFindByIdOutputType>;
}
