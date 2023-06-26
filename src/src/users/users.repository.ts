import {
  ConflictException,
  Dependencies,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import { UsersInterface } from './interfaces/users.interface';
import {
  UsersCreateInputDto,
  UsersCreateOutputDto,
} from './dtos/users.create.dto';
import {
  UsersDeleteInputDto,
  UsersDeleteOutputDto,
} from './dtos/users.delete.dto';
import {
  UsersInquiryInputDto,
  UsersInquiryOutputDto,
} from './dtos/users.inquiry.dto';
import { UsersListInputDto, UsersListOutputDto } from './dtos/users.list.dto';
import {
  UsersUpdateInputDto,
  UsersUpdateOutputDto,
} from './dtos/users.update.dto';
import { Users } from '@prisma/client';
import { errorHandling } from '../_common/dtos/error.handling';
import { DATE_TIME } from '../_common/dtos/get.date';
import { NOTFOUND_USER } from '../_common/http/errors/404';
import {
  getListOffsetPagination,
  PageReturnType,
} from '../_common/dtos/get.list.page.nation';
import {
  ALREADY_APP_ID,
  ALREADY_NICKNAME,
  ALREADY_PHONE,
} from '../_common/http/errors/409';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';

@Injectable()
@Dependencies([PrismaService])
export class UsersRepository implements UsersInterface {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('HASH_ENCODED') private readonly hash: HashEncodedService,
    @Inject('HASH_DECODED') private readonly compare: HashDecodedService,
    @Inject('TOKEN_SERVICE') private readonly jwtToken: TokenService,
  ) {}

  public async create(dto: UsersCreateInputDto): Promise<UsersCreateOutputDto> {
    const { appId, phone, nickname, password } = dto;

    const userFindByAppId: Users = await this.prisma.users.findUnique({
      where: { appId },
    });
    if (userFindByAppId) throw new ConflictException(ALREADY_APP_ID);

    const userFindByPhone: Users = await this.prisma.users.findUnique({
      where: { phone },
    });
    if (userFindByPhone) throw new ConflictException(ALREADY_PHONE);

    const userFindByNickname: Users = await this.prisma.users.findUnique({
      where: { nickname },
    });
    if (userFindByNickname) throw new ConflictException(ALREADY_NICKNAME);

    const {
      response: { encoded: hashPassword },
    } = await this.hash.encoded({ password });

    try {
      const createUser: Users = await this.prisma.$transaction(
        async () =>
          await this.prisma.users.create({
            data: {
              appId,
              nickname,
              password: hashPassword,
              phone,
              createdDate: DATE_TIME,
            },
          }),
      );

      return { response: createUser };
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async delete(dto: UsersDeleteInputDto): Promise<UsersDeleteOutputDto> {
    const { id } = dto;

    const userFindById: Users = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!userFindById) throw new NotFoundException();

    try {
      const deletedAtUser: Users = await this.prisma.$transaction(
        async () =>
          await this.prisma.users.update({
            where: { id },
            data: {
              deletedDate: DATE_TIME,
            },
          }),
      );

      return { response: deletedAtUser };
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async inquiry(
    dto: UsersInquiryInputDto,
  ): Promise<UsersInquiryOutputDto> {
    const { id } = dto;

    const userFindById: Users = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);
    return { response: userFindById };
  }

  public async list(dto: UsersListInputDto): Promise<UsersListOutputDto> {
    const userCount: number = await this.prisma.users.count();
    const totalTake: number = userCount;

    const pagination: PageReturnType = getListOffsetPagination({
      page: dto.page,
      take: dto.take,
      totalTake,
    });

    const currentList: Users[] = await this.prisma.users.findMany({
      orderBy: [
        {
          createdDate: 'desc',
        },
      ],
      skip: pagination.skip,
      take: pagination.take,
    });

    return {
      response: {
        currentList,
        totalTake,
        totalPages: pagination.totalPages,
        currentPage: pagination.currentPage,
      },
    };
  }

  public async update(dto: UsersUpdateInputDto): Promise<UsersUpdateOutputDto> {
    const { id, appId, nickname, phone, password } = dto;

    const userFindByIdAndAppId: Users = await this.prisma.users.findFirst({
      where: { AND: [{ id }, { appId }] },
    });
    if (!userFindByIdAndAppId) throw new NotFoundException(NOTFOUND_USER);

    const updateNickname: string =
      nickname === '' ? userFindByIdAndAppId.nickname : nickname;
    if (!!nickname) {
      const userFindByNickname: Users = await this.prisma.users.findUnique({
        where: { nickname },
      });

      if (
        userFindByIdAndAppId.nickname !== nickname &&
        userFindByNickname.nickname === nickname
      ) {
        throw new ConflictException(ALREADY_NICKNAME);
      }
    }

    const updatePhone: string =
      phone === '' ? userFindByIdAndAppId.phone : phone;
    if (!!phone) {
      const userFindByPhone: Users = await this.prisma.users.findUnique({
        where: { phone },
      });

      if (
        userFindByIdAndAppId.phone !== phone &&
        userFindByPhone.phone === phone
      ) {
        throw new ConflictException(ALREADY_PHONE);
      }
    }

    const {
      response: { encoded: hashPassword },
    } = await this.hash.encoded({ password });

    const updatePassword: string =
      password === '' ? userFindByIdAndAppId.password : hashPassword;

    return {
      response: {
        id,
        appId,
        nickname: updateNickname,
        phone: updatePhone,
        password: updatePassword,
        refreshToken: userFindByIdAndAppId.refreshToken,
        createdDate: userFindByIdAndAppId.createdDate,
        deletedDate: userFindByIdAndAppId.deletedDate,
        updatedDate: userFindByIdAndAppId.updatedDate,
      },
    };
  }
}
