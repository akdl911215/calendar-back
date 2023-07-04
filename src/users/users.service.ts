import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersInterface } from './interfaces/users.interface';
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
import {
  APP_ID_REQUIRED,
  NICKNAME_REQUIRED,
  PAGE_REQUIRED,
  PASSWORD_REQUIRED,
  PHONE_REQUIRED,
  TAKE_REQUIRED,
  UNIQUE_ID_REQUIRED,
} from '../_common/http/errors/400';
import { UsersModel } from './entites/users.model';
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
import { UsersFindByInterface } from './interfaces/users.find.by.interface';
import {
  UsersFindByIdInputDto,
  UsersFindByIdOutputDto,
} from './dtos/users.find.by.id.dto';

interface UsersMergeInterface
  extends UsersInterface,
    UsersRefreshTokenReIssuanceInterface,
    UsersFindByInterface {}

@Injectable()
export class UsersService implements UsersMergeInterface {
  constructor(
    @Inject('REPOSITORY') private readonly repository: UsersMergeInterface,
  ) {}

  public async create(dto: UsersCreateInputDto): Promise<UsersCreateOutputDto> {
    const { appId, phone, nickname, password } = dto;

    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);
    if (!password) throw new BadRequestException(PASSWORD_REQUIRED);
    if (!phone) throw new BadRequestException(PHONE_REQUIRED);
    if (!nickname) throw new BadRequestException(NICKNAME_REQUIRED);

    const user = new UsersModel();
    user.setCreate(dto);

    return await this.repository.create(user.getCreate());
  }

  public async delete(dto: UsersDeleteInputDto): Promise<UsersDeleteOutputDto> {
    const { id } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const user = new UsersModel();
    user.setDelete(dto);

    return await this.repository.delete(user.getDelete());
  }

  public async list(dto: UsersListInputDto): Promise<UsersListOutputDto> {
    const { take, page } = dto;
    if (take < 1) throw new BadRequestException(TAKE_REQUIRED);
    if (page < 1) throw new BadRequestException(PAGE_REQUIRED);

    return await this.repository.list(dto);
  }

  public async update(dto: UsersUpdateInputDto): Promise<UsersUpdateOutputDto> {
    const { id, appId } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);

    const user = new UsersModel();
    user.setUpdate({
      id: dto.id,
      appId: dto.appId,
      nickname: dto?.nickname,
      password: dto?.password,
      phone: dto?.phone,
    });

    return await this.repository.update(user.getUpdate());
  }

  public async login(dto: UsersLoginInputDto): Promise<UsersLoginOutputDto> {
    const { appId, password } = dto;
    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);
    if (!password) throw new BadRequestException(PASSWORD_REQUIRED);

    const user = new UsersModel();
    user.setLogin(dto);

    return await this.repository.login(user.getLogin());
  }

  public async logout(dto: UsersLogoutInputDto): Promise<UsersLogoutOutputDto> {
    const { id } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const user = new UsersModel();
    user.setLogout(dto);

    return await this.repository.logout(user.getLogout());
  }

  public async profile(
    dto: UsersProfileInputDto,
  ): Promise<UsersProfileOutputDto> {
    const { id } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const user = new UsersModel();
    user.setProfile(dto);

    return await this.repository.profile(user.getProfile());
  }

  public async refresh(
    dto: UsersRefreshTokenReIssuanceInputDto,
  ): Promise<UsersRefreshTokenReIssuanceOutputDto> {
    const { id, appId, phone } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);
    if (!phone) throw new BadRequestException(PHONE_REQUIRED);

    const user = new UsersModel();
    user.setRefreshTokenReIssuance(dto);

    return await this.repository.refresh(user.getRefreshTokenReIssuance());
  }

  public async usersFindById(
    dto: UsersFindByIdInputDto,
  ): Promise<UsersFindByIdOutputDto> {
    const { id } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const user = new UsersModel();
    user.setUsersFindById(dto);

    return await this.repository.usersFindById(user.getUsersFindById());
  }
}
