import { UsersBaseDto } from './users.base.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UsersCompareCurrentPasswordAndPasswordInputDto extends PickType(
  UsersBaseDto,
  ['id', 'password'],
) {
  @ApiProperty({ type: String, required: true, format: 'password' })
  public confirmPassword!: string;

  @ApiProperty({ type: String, required: true, format: 'password' })
  public currentPassword!: string;
}

export class UsersCompareCurrentPasswordAndPasswordOutputDto {
  readonly compare: boolean;
}
