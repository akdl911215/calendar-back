import {
  UsersFindByIdInputDto,
  UsersFindByIdOutputDto,
} from '../dtos/users.find.by.id.dto';

export interface UsersFindByInterface {
  readonly usersFindById: (
    dto: UsersFindByIdInputDto,
  ) => Promise<UsersFindByIdOutputDto>;
}
