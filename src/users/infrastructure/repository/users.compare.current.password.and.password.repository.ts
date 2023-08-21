import {
  BadRequestException,
  Dependencies,
  Inject,
  Injectable,
} from '@nestjs/common';
import { HashDecodedService } from '../bcrypt/hash.decoded.service';
import { CalendarUsers } from '@prisma/client';
import { PrismaService } from '../../../_common/prisma/prisma.service';
import { UsersCompareCurrentPasswordAndPasswordInterface } from '../../interfaces/users.compare.current.password.and.password.interface';
import {
  UsersCompareCurrentPasswordAndPasswordInputDto,
  UsersCompareCurrentPasswordAndPasswordOutputDto,
} from '../../dtos/users.compare.current.password.and.password.dto';
import { UNIQUE_ID_REQUIRED } from '../../../_common/https/errors/400';
import { UsersModel } from '../../entites/users.model';

@Injectable()
@Dependencies([HashDecodedService, PrismaService])
export class UsersCompareCurrentPasswordAndPasswordRepository
  implements UsersCompareCurrentPasswordAndPasswordInterface
{
  constructor(
    @Inject('HASH_DECODED') private readonly compare: HashDecodedService,
    private readonly prisma: PrismaService,
  ) {}

  public async compareCurrentPasswordAndPassword(
    dto: UsersCompareCurrentPasswordAndPasswordInputDto,
  ): Promise<UsersCompareCurrentPasswordAndPasswordOutputDto> {
    if (!dto?.id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const user = new UsersModel();
    user._compareCurrentPasswordAndPassword = { id: dto.id };

    const { id } = user._compareCurrentPasswordAndPassword;
    const { currentPassword } = dto;

    const dbUser: CalendarUsers = await this.prisma.calendarUsers.findUnique({
      where: { id },
    });
    const { password } = dbUser;

    const compare = await this.compare.decoded({
      password: currentPassword,
      hashPassword: password,
    });

    if (compare.decoded) {
      return { compare: true };
    } else {
      return { compare: false };
    }
  }
}
