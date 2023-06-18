import {
  BaseOffsetPaginationInputDto,
  BasePaginationOffsetOutputDto,
} from '../../_common/dtos/base.pagination.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';
import { Users } from '@prisma/client';

export class UsersListInputDto extends BaseOffsetPaginationInputDto {}

export class UsersListOutputDto extends BaseOutputDto<
  BasePaginationOffsetOutputDto<Users>
> {}
