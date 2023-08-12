import {
  UsersCreateInputDto,
  UsersCreateOutputDto,
} from '../dtos/users.create.dto';
import {
  UsersDeleteInputDto,
  UsersDeleteOutputDto,
} from '../dtos/users.delete.dto';
import { UsersListInputDto, UsersListOutputDto } from '../dtos/users.list.dto';
import {
  UsersUpdateInputDto,
  UsersUpdateOutputDto,
} from '../dtos/users.update.dto';
import {
  UsersLoginInputDto,
  UsersLoginOutputDto,
} from '../dtos/users.login.dto';
import {
  UsersLogoutInputDto,
  UsersLogoutOutputDto,
} from '../dtos/users.logout.dto';
import {
  UsersProfileInputDto,
  UsersProfileOutputDto,
} from '../dtos/users.profile.dto';

export interface UsersDtoInterface {
  readonly create: (dto: UsersCreateInputDto) => Promise<UsersCreateOutputDto>;

  readonly delete: (dto: UsersDeleteInputDto) => Promise<UsersDeleteOutputDto>;

  readonly list: (dto: UsersListInputDto) => Promise<UsersListOutputDto>;

  readonly update: (dto: UsersUpdateInputDto) => Promise<UsersUpdateOutputDto>;

  readonly login: (dto: UsersLoginInputDto) => Promise<UsersLoginOutputDto>;

  readonly logout: (dto: UsersLogoutInputDto) => Promise<UsersLogoutOutputDto>;

  readonly profile: (
    dto: UsersProfileInputDto,
  ) => Promise<UsersProfileOutputDto>;
}
