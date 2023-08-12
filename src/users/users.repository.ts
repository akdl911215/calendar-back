import {
  BadRequestException,
  ConflictException,
  Dependencies,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import {
  UsersCreateInputDto,
  UsersCreateOutputDto,
} from './dtos/users.create.dto';
import {
  UsersDeleteInputDto,
  UsersDeleteOutputDto,
} from './dtos/users.delete.dto';
import { UsersListInputDto, UsersListOutputDto } from './dtos/users.list.dto';
import {
  UsersUpdateInputDto,
  UsersUpdateOutputDto,
} from './dtos/users.update.dto';
import { Users } from '@prisma/client';
import { errorHandling } from '../_common/dtos/error.handling';
import { DATE } from '../_common/dtos/get.date';
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
import { UsersRefreshTokenReIssuanceInterface } from './interfaces/users.refresh.token.re.issuance.interface';
import {
  UsersLoginInputDto,
  UsersLoginOutputDto,
} from './dtos/users.login.dto';
import {
  UsersLogoutInputDto,
  UsersLogoutOutputDto,
} from './dtos/users.logout.dto';
import {
  UsersProfileInputDto,
  UsersProfileOutputDto,
} from './dtos/users.profile.dto';
import {
  UsersRefreshTokenReIssuanceInputDto,
  UsersRefreshTokenReIssuanceOutputDto,
} from './dtos/user.refresh.token.re.issuance.dto';
import { NO_MATCH_APP_ID, NO_MATCH_PASSWORD } from '../_common/http/errors/400';
import { AccessTokenPayloadType } from './infrastructure/token/type/access.token.payload.type';
import { RefreshTokenPayloadType } from './infrastructure/token/type/refresh.token.payload.type';
import { UsersFindByEntityInterface } from './interfaces/users.find.by.entity.interface';
import {
  UsersFindByIdInputDto,
  UsersFindByIdOutputDto,
} from './dtos/users.find.by.id.dto';
import { UsersEntityInterface } from './interfaces/users.entity.interface';
import { BaseOffsetPaginationOutputDto } from '../_common/dtos/base.pagination.dto';
import {
  UsersCreateEntityInputType,
  UsersCreateEntityOutputType,
  UsersDeleteEntityInputType,
  UsersDeleteEntityOutputType,
  UsersListEntityInputType,
  UsersListEntityOutputType,
  UsersLoginEntityInputType,
  UsersLoginEntityOutputType,
  UsersLogoutEntityInputType,
  UsersLogoutEntityOutputType,
  UsersProfileEntityInputType,
  UsersProfileEntityOutputType,
  UsersUpdateEntityInputType,
  UsersUpdateEntityOutputType,
} from './entites/users.entity.interface.type';

@Injectable()
@Dependencies([
  PrismaService,
  HashEncodedService,
  HashDecodedService,
  TokenService,
])
export class UsersRepository
  implements
    UsersEntityInterface,
    UsersRefreshTokenReIssuanceInterface,
    UsersFindByEntityInterface
{
  constructor(
    private readonly prisma: PrismaService,
    @Inject('HASH_ENCODED') private readonly hash: HashEncodedService,
    @Inject('HASH_DECODED') private readonly compare: HashDecodedService,
    @Inject('TOKEN_SERVICE') private readonly jwtToken: TokenService,
  ) {}

  public async create(
    entity: UsersCreateEntityInputType,
  ): Promise<UsersCreateEntityOutputType> {
    const { appId, phone, nickname, password } = entity;

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
            },
          }),
      );

      return createUser;
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async delete(
    entity: UsersDeleteEntityInputType,
  ): Promise<UsersDeleteEntityOutputType> {
    const { id } = entity;

    const userFindById: Users = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    try {
      const deletedAtUser: Users = await this.prisma.$transaction(
        async () =>
          await this.prisma.users.update({
            where: { id },
            data: {
              deletedAt: DATE,
            },
          }),
      );

      return deletedAtUser;
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async list(
    entity: UsersListEntityInputType,
  ): Promise<UsersListEntityOutputType> {
    const userCount: number = await this.prisma.users.count();
    const totalTake: number = userCount;

    const pagination: PageReturnType = getListOffsetPagination({
      page: entity.page,
      take: entity.take,
      totalTake,
    });

    const list: Users[] = await this.prisma.users.findMany({
      where: { deletedAt: null },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      skip: pagination.skip,
      take: pagination.take,
    });

    const currentList = list.map((el) => {
      return {
        id: el.id,
        appId: el.appId,
        nickname: el.nickname,
        phone: el.phone,
        createdAt: el.createdAt,
      };
    });

    return {
      currentList,
      totalTake,
      totalPages: pagination.totalPages,
      currentPage: pagination.currentPage,
    };
  }

  public async update(
    entity: UsersUpdateEntityInputType,
  ): Promise<UsersUpdateEntityOutputType> {
    const { id, appId, nickname, phone, password } = entity;

    const userFindByIdAndAppId: Users = await this.prisma.users.findFirst({
      where: { AND: [{ id }, { appId }] },
    });
    if (!userFindByIdAndAppId) throw new NotFoundException(NOTFOUND_USER);

    const {
      response: { encoded: hashPassword },
    } = await this.hash.encoded({ password });

    const updatePassword: string =
      password === '' ? userFindByIdAndAppId.password : hashPassword;

    try {
      const updateUser: Users = await this.prisma.$transaction(
        async () =>
          await this.prisma.users.update({
            where: { id },
            data: {
              nickname,
              phone,
              password: updatePassword,
              updatedAt: DATE,
            },
          }),
      );

      return updateUser;
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async login(
    entity: UsersLoginEntityInputType,
  ): Promise<UsersLoginEntityOutputType> {
    const { appId, password } = entity;

    const userFindByAppId: Users = await this.prisma.users.findUnique({
      where: { appId },
    });
    if (!userFindByAppId) throw new BadRequestException(NO_MATCH_APP_ID);

    const {
      response: { decoded },
    } = await this.compare.decoded({
      password,
      hashPassword: userFindByAppId.password,
    });
    const comparePassword: boolean = decoded;
    if (!comparePassword) throw new BadRequestException(NO_MATCH_PASSWORD);

    const accessPayload: AccessTokenPayloadType = {
      id: userFindByAppId.id,
      appId: userFindByAppId.appId,
    };

    const refreshPayload: RefreshTokenPayloadType = {
      id: userFindByAppId.id,
      appId: userFindByAppId.appId,
      phone: userFindByAppId.phone,
    };

    const {
      response: { refreshToken, accessToken },
    } = await this.jwtToken.generateTokens(accessPayload, refreshPayload);

    try {
      const loginSuccess: Users = await this.prisma.$transaction(
        async () =>
          await this.prisma.users.update({
            where: { id: userFindByAppId.id },
            data: { refreshToken },
          }),
      );

      return {
        ...loginSuccess,
        accessToken,
      };
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async logout(
    entity: UsersLogoutEntityInputType,
  ): Promise<UsersLogoutEntityOutputType> {
    const { id } = entity;

    const userFindById: Users = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    try {
      const logoutUsers: Users = await this.prisma.$transaction(
        async () =>
          await this.prisma.users.update({
            where: { id },
            data: { refreshToken: null },
          }),
      );

      if (logoutUsers.refreshToken === null) {
        return { logout: true };
      } else {
        return { logout: false };
      }
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async profile(
    entity: UsersProfileEntityInputType,
  ): Promise<UsersProfileEntityOutputType> {
    const { id } = entity;

    const userFindById: Users = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    return userFindById;
  }

  public async refresh(
    entity: UsersRefreshTokenReIssuanceInputDto,
  ): Promise<UsersRefreshTokenReIssuanceOutputDto> {
    const { id, appId, phone } = entity;

    const accessPayload: AccessTokenPayloadType = { id, appId };
    const refreshPayload: RefreshTokenPayloadType = { id, appId, phone };

    const {
      response: { accessToken, refreshToken },
    } = await this.jwtToken.generateTokens(accessPayload, refreshPayload);

    try {
      const refreshTokenUpdate: Users = await this.prisma.$transaction(
        async () =>
          await this.prisma.users.update({
            where: { id },
            data: { refreshToken },
          }),
      );

      return {
        response: {
          id: refreshTokenUpdate.id,
          appId: refreshTokenUpdate.appId,
          phone: refreshTokenUpdate.phone,
          accessToken,
          refreshToken,
        },
      };
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async usersFindById(
    entity: UsersFindByIdInputDto,
  ): Promise<UsersFindByIdOutputDto> {
    const { id } = entity;

    const userFindById: Users = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    return { response: userFindById };
  }
}
