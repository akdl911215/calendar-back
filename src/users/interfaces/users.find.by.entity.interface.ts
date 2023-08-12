import {
  UsersFindByIdInputDto,
  UsersFindByIdOutputDto,
} from '../dtos/users.find.by.id.dto';

export interface UsersFindByEntityInterface {
  readonly usersFindById: (
    entity: UsersFindByIdInputDto,
  ) => Promise<UsersFindByIdOutputDto>;
}
