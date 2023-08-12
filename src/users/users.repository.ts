import {
  BadRequestException,
  ConflictException,
  Dependencies,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../_common/prisma/prisma.service';
import { CalendarUsers } from '@prisma/client';
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
import { NO_MATCH_APP_ID, NO_MATCH_PASSWORD } from '../_common/http/errors/400';
import { AccessTokenPayloadType } from './infrastructure/token/type/access.token.payload.type';
import { RefreshTokenPayloadType } from './infrastructure/token/type/refresh.token.payload.type';
import { UsersFindByEntityInterface } from './interfaces/users.find.by.entity.interface';
import {
  UsersFindByIdInputType,
  UsersFindByIdOutputType,
} from './dtos/users.find.by.id.dto';
import { UsersEntityInterface } from './interfaces/users.entity.interface';
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
  UsersRefreshReIssuanceEntityInputType,
  UsersRefreshReIssuanceEntityOutputType,
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
    const { appId, phone, nickname, password, email } = entity;

    const userFindByAppId: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { app_id: appId },
      });
    if (userFindByAppId) throw new ConflictException(ALREADY_APP_ID);

    const userFindByPhone: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { phone },
      });
    if (userFindByPhone) throw new ConflictException(ALREADY_PHONE);

    const userFindByNickname: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { nickname },
      });
    if (userFindByNickname) throw new ConflictException(ALREADY_NICKNAME);

    const {
      response: { encoded: hashPassword },
    } = await this.hash.encoded({ password });

    try {
      const createUser: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.create({
            data: {
              app_id: appId,
              nickname,
              password: hashPassword,
              phone,
              email,
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

    const userFindById: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { id },
      });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    try {
      const deletedAtUser: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id },
            data: {
              deleted_at: DATE,
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
    const userCount: number = await this.prisma.calendarUsers.count();
    const totalTake: number = userCount;

    const pagination: PageReturnType = getListOffsetPagination({
      page: entity.page,
      take: entity.take,
      totalTake,
    });

    const list: CalendarUsers[] = await this.prisma.calendarUsers.findMany({
      where: { deleted_at: null },
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
      skip: pagination.skip,
      take: pagination.take,
    });

    const currentList = list.map((el) => {
      return {
        id: el.id,
        appId: el.app_id,
        nickname: el.nickname,
        phone: el.phone,
        created_at: el.created_at,
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
    const { id, appId, nickname, phone, password, email } = entity;

    const userFindByIdAndAppId: CalendarUsers =
      await this.prisma.calendarUsers.findFirst({
        where: { AND: [{ id }, { app_id: appId }, { email }] },
      });
    if (!userFindByIdAndAppId) throw new NotFoundException(NOTFOUND_USER);

    const {
      response: { encoded: hashPassword },
    } = await this.hash.encoded({ password });

    const updatePassword: string =
      password === '' ? userFindByIdAndAppId.password : hashPassword;

    try {
      const updateUser: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id },
            data: {
              nickname,
              phone,
              email,
              password: updatePassword,
              updated_at: DATE,
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

    const userFindByAppId: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { app_id: appId },
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
      appId: userFindByAppId.app_id,
    };

    const refreshPayload: RefreshTokenPayloadType = {
      id: userFindByAppId.id,
      appId: userFindByAppId.app_id,
      phone: userFindByAppId.phone,
    };

    const {
      response: { refreshToken, accessToken },
    } = await this.jwtToken.generateTokens(accessPayload, refreshPayload);

    try {
      const loginSuccess: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id: userFindByAppId.id },
            data: { refresh_token: refreshToken },
          }),
      );

      return {
        ...loginSuccess,
        access_token: accessToken,
      };
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async logout(
    entity: UsersLogoutEntityInputType,
  ): Promise<UsersLogoutEntityOutputType> {
    const { id } = entity;

    const userFindById: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { id },
      });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    try {
      const logoutUsers: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id },
            data: { refresh_token: null },
          }),
      );

      if (logoutUsers.refresh_token === null) {
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

    const userFindById: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { id },
      });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    return userFindById;
  }

  public async refresh(
    entity: UsersRefreshReIssuanceEntityInputType,
  ): Promise<UsersRefreshReIssuanceEntityOutputType> {
    const { id, appId, phone } = entity;

    const accessPayload: AccessTokenPayloadType = { id, appId };
    const refreshPayload: RefreshTokenPayloadType = { id, appId, phone };

    const {
      response: { accessToken, refreshToken },
    } = await this.jwtToken.generateTokens(accessPayload, refreshPayload);

    try {
      const refreshTokenUpdate: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id },
            data: { refresh_token: refreshToken },
          }),
      );

      return {
        id: refreshTokenUpdate.id,
        app_id: refreshTokenUpdate.app_id,
        phone: refreshTokenUpdate.phone,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async usersFindById(
    entity: UsersFindByIdInputType,
  ): Promise<UsersFindByIdOutputType> {
    const { id } = entity;

    const userFindById: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { id },
      });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    return userFindById;
  }
}
