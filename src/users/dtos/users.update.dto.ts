import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { BaseOutputDto } from '../../_common/dtos/base.output.dto';

export class UsersUpdateInputDto {
  @IsUUID()
  public id!: string;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    required: false,
    description: '앱 아이디',
  })
  @IsOptional()
  @Matches(/^[A-za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,12}$/, {
    message: 'ID은 2자리 이상 12자리 이하입니다.',
  })
  public appId?: string;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    required: false,
    description: '닉네임',
  })
  @IsOptional()
  @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,12}$/, {
    message: '닉네임은 2자리 이상 12자리 이하입니다.',
  })
  public nickname?: string;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    format: 'password',
    required: false,
    description: '비밀번호',
  })
  @IsOptional()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      '비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수문자입니다.',
  })
  public password?: string;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    required: false,
    description: '핸드폰 번호',
  })
  @IsOptional()
  public phone?: string;
}

export class UsersUpdateOutputDto extends BaseOutputDto<Users> {}
