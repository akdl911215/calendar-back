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
import { NOTFOUND_USER } from '../_common/https/errors/404';
import {
  getListOffsetPagination,
  PageReturnType,
} from '../_common/dtos/get.list.page.nation';
import { ALREADY_USER } from '../_common/https/errors/409';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { UsersRefreshTokenReIssuanceInterface } from './interfaces/users.refresh.token.re.issuance.interface';
import {
  NO_MATCH_APP_ID,
  NO_MATCH_PASSWORD,
} from '../_common/https/errors/400';
import { AccessTokenPayloadType } from './infrastructure/token/type/access.token.payload.type';
import { RefreshTokenPayloadType } from './infrastructure/token/type/refresh.token.payload.type';
import { UsersFindByEntityInterface } from './interfaces/users.find.by.entity.interface';
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
  UsersReIssuancePasswordEntityInputType,
  UsersReIssuancePasswordEntityOutputType,
  UsersUpdateEmailEntityInputType,
  UsersUpdateEmailEntityOutputType,
  UsersUpdateNicknameEntityInputType,
  UsersUpdateNicknameEntityOutputType,
  UsersUpdatePhoneEntityInputType,
  UsersUpdatePhoneEntityOutputType,
} from './entites/users.entity.interface.type';
import {
  UsersFindByAppIdInputType,
  UsersFindByAppIdOutputType,
  UsersFindByEmailInputType,
  UsersFindByEmailOutputType,
  UsersFindByIdInputType,
  UsersFindByIdOutputType,
  UsersFindByNicknameInputType,
  UsersFindByNicknameOutputType,
  UsersFindByPhoneInputType,
  UsersFindByPhoneOutputType,
} from './entites/users.find.by.entity.interface.type';
import { UsersDuplicateVerificationEntityInterface } from './interfaces/users.duplicate.verification.entity.interface';
import {
  UsersAppIdDuplicateVerificationInputType,
  UsersAppIdDuplicateVerificationOutputType,
  UsersEmailDuplicateVerificationInputType,
  UsersEmailDuplicateVerificationOutputType,
  UsersNicknameDuplicateVerificationInputType,
  UsersNicknameDuplicateVerificationOutputType,
  UsersPhoneDuplicateVerificationInputType,
  UsersPhoneDuplicateVerificationOutputType,
} from './entites/users.duplicate.verification.entity.interface.type';

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
    UsersFindByEntityInterface,
    UsersDuplicateVerificationEntityInterface
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

    const searchUser: CalendarUsers = await this.prisma.calendarUsers.findFirst(
      {
        where: { OR: [{ app_id: appId }, { phone }, { nickname }, { email }] },
      },
    );
    if (searchUser) throw new ConflictException(ALREADY_USER);

    const { encoded: hashPassword } = await this.hash.encoded({ password });

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

  private count = async (): Promise<number> =>
    await this.prisma.calendarUsers.count({
      where: { deleted_at: null },
    });

  public async list(
    entity: UsersListEntityInputType,
  ): Promise<UsersListEntityOutputType> {
    const totalTake: number = await this.count();

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

    const currentList = list.map((el: CalendarUsers) => {
      return {
        id: el.id,
        app_id: el.app_id,
        nickname: el.nickname,
        email: el.email,
        phone: el.phone,
        created_at: el.created_at,
      };
    });

    return {
      current_list: currentList,
      total_take: totalTake,
      total_pages: pagination.totalPages,
      current_page: pagination.currentPage,
    };
  }

  public async updateNickname(
    entity: UsersUpdateNicknameEntityInputType,
  ): Promise<UsersUpdateNicknameEntityOutputType> {
    const { id, nickname } = entity;

    const userFindByIdAndAppId: CalendarUsers =
      await this.prisma.calendarUsers.findFirst({
        where: { AND: [{ id }, { nickname }] },
      });
    if (!userFindByIdAndAppId) throw new NotFoundException(NOTFOUND_USER);

    try {
      const updateNickname: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id },
            data: {
              nickname,
              updated_at: DATE,
            },
          }),
      );

      return updateNickname;
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async reIssuancePassword(
    entity: UsersReIssuancePasswordEntityInputType,
  ): Promise<UsersReIssuancePasswordEntityOutputType> {
    const { id, password } = entity;

    const userFindById: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { id },
      });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    const { encoded: hashPassword } = await this.hash.encoded({ password });

    try {
      const reIssuancePassword: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id },
            data: {
              password: hashPassword,
              updated_at: DATE,
            },
          }),
      );

      return reIssuancePassword;
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async updatePhone(
    entity: UsersUpdatePhoneEntityInputType,
  ): Promise<UsersUpdatePhoneEntityOutputType> {
    const { id, phone } = entity;

    const userFindByIdAndAppId: CalendarUsers =
      await this.prisma.calendarUsers.findFirst({
        where: { AND: [{ id }, { phone }] },
      });
    if (!userFindByIdAndAppId) throw new NotFoundException(NOTFOUND_USER);

    try {
      const updatePhone: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id },
            data: {
              phone,
              updated_at: DATE,
            },
          }),
      );

      return updatePhone;
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async updateEmail(
    entity: UsersUpdateEmailEntityInputType,
  ): Promise<UsersUpdateEmailEntityOutputType> {
    const { id, email } = entity;

    const userFindByIdAndAppId: CalendarUsers =
      await this.prisma.calendarUsers.findFirst({
        where: { AND: [{ id }, { email }] },
      });
    if (!userFindByIdAndAppId) throw new NotFoundException(NOTFOUND_USER);

    try {
      const updateEmail: CalendarUsers = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendarUsers.update({
            where: { id },
            data: {
              email,
              updated_at: DATE,
            },
          }),
      );

      return updateEmail;
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

    const { decoded } = await this.compare.decoded({
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

    const { refreshToken, accessToken } = await this.jwtToken.generateTokens(
      accessPayload,
      refreshPayload,
    );

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

    const { accessToken, refreshToken } = await this.jwtToken.generateTokens(
      accessPayload,
      refreshPayload,
    );

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

  public async userFindById(
    entity: UsersFindByIdInputType,
  ): Promise<UsersFindByIdOutputType> {
    const userFindById: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: entity,
      });
    if (!userFindById) throw new NotFoundException(NOTFOUND_USER);

    return userFindById;
  }

  public async usersFindByAppId(
    entity: UsersFindByAppIdInputType,
  ): Promise<UsersFindByAppIdOutputType> {
    const userFindByAppId: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({
        where: { app_id: entity.appId },
      });
    if (!userFindByAppId) throw new NotFoundException(NOTFOUND_USER);

    return userFindByAppId;
  }

  public async usersFindByEmail(
    entity: UsersFindByEmailInputType,
  ): Promise<UsersFindByEmailOutputType> {
    const userFindByEmail: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({ where: entity });
    if (!userFindByEmail) throw new NotFoundException(NOTFOUND_USER);

    return userFindByEmail;
  }

  public async usersFindByNickname(
    entity: UsersFindByNicknameInputType,
  ): Promise<UsersFindByNicknameOutputType> {
    const userFindByNickname: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({ where: entity });
    if (!userFindByNickname) throw new NotFoundException(NOTFOUND_USER);

    return userFindByNickname;
  }

  public async usersFindByPhone(
    entity: UsersFindByPhoneInputType,
  ): Promise<UsersFindByPhoneOutputType> {
    const userFindByPhone: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({ where: entity });
    if (!userFindByPhone) throw new NotFoundException(NOTFOUND_USER);

    return userFindByPhone;
  }

  public async appIdDuplicateVerification(
    entity: UsersAppIdDuplicateVerificationInputType,
  ): Promise<UsersAppIdDuplicateVerificationOutputType> {
    const { appId } = entity;
    const userFindByAppId: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({ where: { app_id: appId } });
    console.log('userFindByAppId  : ', userFindByAppId);

    let str = 'exists';
    if (!userFindByAppId) str = 'nonExists';

    return { appIdExists: str };
  }

  public async emailDuplicateVerification(
    entity: UsersEmailDuplicateVerificationInputType,
  ): Promise<UsersEmailDuplicateVerificationOutputType> {
    const userFindByEmail: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({ where: entity });

    let str = 'exists';
    if (!userFindByEmail) str = 'nonExists';

    return { emailExists: str };
  }

  public async nicknameDuplicateVerification(
    entity: UsersNicknameDuplicateVerificationInputType,
  ): Promise<UsersNicknameDuplicateVerificationOutputType> {
    const userFindByNickname: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({ where: entity });

    let str = 'exists';
    if (!userFindByNickname) str = 'nonExists';
    return { nicknameExists: str };
  }

  public async phoneDuplicateVerification(
    entity: UsersPhoneDuplicateVerificationInputType,
  ): Promise<UsersPhoneDuplicateVerificationOutputType> {
    const userFindByPhone: CalendarUsers =
      await this.prisma.calendarUsers.findUnique({ where: entity });

    let str = 'exists';
    if (!userFindByPhone) str = 'nonExists';
    return { phoneExists: str };
  }
}
