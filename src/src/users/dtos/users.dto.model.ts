import { IsNumber, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsersDtoModel {
  @IsUUID()
  public id!: string;

  @IsNumber()
  public createdDate!: number;

  @IsNumber()
  public updatedDate!: number;

  @IsNumber()
  public deletedDate?: number;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
    description: '앱 아이디',
  })
  @Matches(/^[A-za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,12}$/, {
    message: 'ID은 2자리 이상 12자리 이하입니다.',
  })
  public appId!: string;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
    description: '닉네임',
  })
  @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,12}$/, {
    message: '닉네임은 2자리 이상 12자리 이하입니다.',
  })
  public nickname!: string;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    format: 'password',
    required: true,
    description: '비밀번호',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      '비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수문자입니다.',
  })
  public password!: string;

  @IsString()
  @ApiProperty({
    type: String,
    default: '',
    required: true,
    description: '핸드폰 번호',
  })
  public phone!: string;

  public refreshToken?: string;
}
