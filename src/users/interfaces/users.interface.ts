import {
  UsersCreateInputDto,
  UsersCreateOutputDto,
} from '../dtos/users.create.dto';
import {
  UsersDeleteInputDto,
  UsersDeleteOutputDto,
} from '../dtos/users.delete.dto';
import {
  UsersInquiryInputDto,
  UsersInquiryOutputDto,
} from '../dtos/users.inquiry.dto';
import { UsersListInputDto, UsersListOutputDto } from '../dtos/users.list.dto';
import {
  UsersUpdateInputDto,
  UsersUpdateOutputDto,
} from '../dtos/users.update.dto';

export interface UsersInterface {
  readonly create: (dto: UsersCreateInputDto) => Promise<UsersCreateOutputDto>;

  readonly delete: (dto: UsersDeleteInputDto) => Promise<UsersDeleteOutputDto>;

  readonly inquiry: (
    dto: UsersInquiryInputDto,
  ) => Promise<UsersInquiryOutputDto>;

  readonly list: (dto: UsersListInputDto) => Promise<UsersListOutputDto>;

  readonly update: (dto: UsersUpdateInputDto) => Promise<UsersUpdateOutputDto>;
}
