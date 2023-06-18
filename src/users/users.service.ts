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
import {
  UsersInquiryInputDto,
  UsersInquiryOutputDto,
} from './dtos/users.inquiry.dto';
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

@Injectable()
export class UsersService implements UsersInterface {
  constructor(
    @Inject('REPOSITORY') private readonly repository: UsersInterface,
  ) {}

  public async create(dto: UsersCreateInputDto): Promise<UsersCreateOutputDto> {
    const { appId, phone, nickname, password } = dto;

    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);
    if (!phone) throw new BadRequestException(PHONE_REQUIRED);
    if (!nickname) throw new BadRequestException(NICKNAME_REQUIRED);
    if (!password) throw new BadRequestException(PASSWORD_REQUIRED);

    const user = new UsersModel();
    user.setCreate(dto);

    return await this.repository.create(user.getCreate());
  }

  public async delete(dto: UsersDeleteInputDto): Promise<UsersDeleteOutputDto> {
    const { id } = dto;

    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    return Promise.resolve(undefined);
  }

  public async inquiry(
    dto: UsersInquiryInputDto,
  ): Promise<UsersInquiryOutputDto> {
    const { id } = dto;

    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    return Promise.resolve(undefined);
  }

  public async list(dto: UsersListInputDto): Promise<UsersListOutputDto> {
    const { take, page } = dto;

    if (take < 1) throw new BadRequestException(TAKE_REQUIRED);
    if (page < 1) throw new BadRequestException(PAGE_REQUIRED);

    return Promise.resolve(undefined);
  }

  public async update(dto: UsersUpdateInputDto): Promise<UsersUpdateOutputDto> {
    const { id, appId } = dto;

    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);

    return Promise.resolve(undefined);
  }
}
