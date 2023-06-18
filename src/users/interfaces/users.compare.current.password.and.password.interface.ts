import {
  UsersCompareCurrentPasswordAndPasswordInputDto,
  UsersCompareCurrentPasswordAndPasswordOutputDto,
} from '../dtos/users.compare.current.password.and.password.dto';

export interface UsersCompareCurrentPasswordAndPasswordInterface {
  readonly compareCurrentPasswordAndPassword: (
    dto: UsersCompareCurrentPasswordAndPasswordInputDto,
  ) => Promise<UsersCompareCurrentPasswordAndPasswordOutputDto>;
}
