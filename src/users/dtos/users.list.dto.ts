import {
  BaseOffsetPaginationInputDto,
  BaseOffsetPaginationOutputDto,
} from '../../_common/dtos/base.pagination.dto';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersListInputDto extends BaseOffsetPaginationInputDto {}

export class UsersListOutputDto extends BaseOutputDto<
  BaseOffsetPaginationOutputDto<{
    readonly email: string;
    readonly id: string;
    readonly app_id: string;
    readonly phone: string;
    readonly nickname: string;
    readonly created_at: Date;
  }>
> {}
