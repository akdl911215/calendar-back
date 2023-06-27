import { UsersBaseDto } from './users.base.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersCompareCurrentPasswordAndPasswordInputDto extends PickType(
  UsersBaseDto,
  ['id', 'password'],
) {
  @ApiProperty({ type: String, required: true, format: 'password' })
  public confirmPassword!: string;

  @ApiProperty({ type: String, required: true, format: 'password' })
  public currentPassword!: string;
}

export class UsersCompareCurrentPasswordAndPasswordOutputDto extends BaseOutputDto<{
  readonly compare: boolean;
}> {}
