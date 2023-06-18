import {
  ConflictException,
  Dependencies,
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

@Injectable()
@Dependencies([PrismaService])
export class UsersRepository implements UsersInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async create(dto: UsersCreateInputDto): Promise<UsersCreateOutputDto> {
    const { appId, phone, nickname } = dto;

    const userFindByAppId: Users = await this.prisma.users.findUnique({
      where: { appId },
    });
    if (userFindByAppId) throw new ConflictException();

    const userFindByPhone: Users = await this.prisma.users.findUnique({
      where: { phone },
    });
    if (userFindByPhone) throw new ConflictException();

    const userFindByNickname: Users = await this.prisma.users.findUnique({
      where: { nickname },
    });
    if (userFindByNickname) throw new ConflictException();

    try {
      const createUser: Users = await this.prisma.$transaction(
        async () => await this.prisma.users.create({ data: dto }),
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
        async () => await this.prisma.users.update({ where: { id }, data: {} }),
      );
    } catch (e: any) {
      errorHandling(e);
    }

    return Promise.resolve(undefined);
  }

  public async inquiry(
    dto: UsersInquiryInputDto,
  ): Promise<UsersInquiryOutputDto> {
    return Promise.resolve(undefined);
  }

  public async list(dto: UsersListInputDto): Promise<UsersListOutputDto> {
    return Promise.resolve(undefined);
  }

  public async update(dto: UsersUpdateInputDto): Promise<UsersUpdateOutputDto> {
    return Promise.resolve(undefined);
  }
}
