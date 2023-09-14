import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { CalendarUsers } from '@prisma/client';

export class UsersDto {
  @IsUUID()
  @IsNotEmpty()
  public readonly id!: CalendarUsers['id'];

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,12}$/, {
    message: 'ID은 2자리 이상 12자리 이하입니다.',
  })
  public readonly app_id!: CalendarUsers['app_id'];

  @IsString()
  @IsNotEmpty()
  @Matches(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,12}$/, {
    message: '닉네임은 2자리 이상 12자리 이하입니다.',
  })
  public readonly nickname!: CalendarUsers['nickname'];
}
