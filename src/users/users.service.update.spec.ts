import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersUpdateInputDto } from './dtos/users.update.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATE } from '../_common/dtos/get.date';

describe('Users Update Process', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'REPOSITORY',
          useClass: UsersRepository,
        },
        PrismaService,
        {
          provide: 'HASH_ENCODED',
          useClass: HashEncodedService,
        },
        { provide: 'HASH_DECODED', useClass: HashDecodedService },
        { provide: 'TOKEN_SERVICE', useClass: TokenService },
        ConfigService,
        JwtService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('user update unit test', () => {
    it('id empty, so it fails', async () => {
      const dto: UsersUpdateInputDto = {
        id: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'unique_id_required',
            statusCode: 400,
          });
        }
      }
    });

    it('app-id empty, so it fails', async () => {
      const dto: UsersUpdateInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        appId: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'app_id_required',
            statusCode: 400,
          });
        }
      }
    });

    it('user find by id and app-id not-found, so it fails', async () => {
      const dto: UsersUpdateInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        appId: 'aaa',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof NotFoundException) {
          expect(status).toStrictEqual(404);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Not Found',
            message: 'user',
            statusCode: 404,
          });
        }
      }
    });

    it('already nickname, so it fails', async () => {
      const dto: UsersUpdateInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        appId: 'aaa',
        nickname: 'test1111Nick',
      };

      const updateDto = {
        id: dto.id,
        appId: dto.appId,
        password: 'qwer!234',
        phone: '01012312344',
        nickname: 'testNick',
        refreshToken: null,
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: null,
      };

      const conflictNickname = {
        id: dto.id,
        appId: dto.appId,
        password: 'qwer!234',
        phone: '01012312344',
        nickname: dto.nickname,
        refreshToken: null,
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: null,
      };

      jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(updateDto);
      jest
        .spyOn(prisma.users, 'findUnique')
        .mockResolvedValue(conflictNickname);

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof ConflictException) {
          expect(status).toStrictEqual(409);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 409,
            message: 'already_nickname',
            error: 'Conflict',
          });
        }
      }
    });

    it('already phone, so it fails', async () => {
      const dto: UsersUpdateInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        appId: 'aaa',
        nickname: 'test1111Nick',
        phone: '01050939902',
      };

      const updateDto = {
        id: dto.id,
        appId: dto.appId,
        password: 'qwer!234',
        phone: '01012312344',
        nickname: 'testNick',
        refreshToken: null,
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: null,
      };

      const conflictPhone = {
        id: dto.id,
        appId: dto.appId,
        password: 'qwer!234',
        phone: dto.phone,
        nickname: updateDto.nickname,
        refreshToken: null,
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: null,
      };

      jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(updateDto);
      jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(conflictPhone);

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof ConflictException) {
          expect(status).toStrictEqual(409);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 409,
            message: 'already_phone',
            error: 'Conflict',
          });
        }
      }
    });

    it('success should user update', async () => {
      const dto: UsersUpdateInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        appId: 'aaa',
        password: 'wer!234',
      };

      const updateDto = {
        id: dto.id,
        appId: dto.appId,
        password: 'qwer!234',
        phone: '01012312344',
        nickname: 'testNick',
        refreshToken: null,
        createdAt: DATE,
        updatedAt: DATE,
        deletedAt: null,
      };

      jest.spyOn(prisma.users, 'findFirst').mockResolvedValue(updateDto);
      jest.spyOn(prisma.users, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.users, 'update').mockResolvedValue(updateDto);

      try {
        const { response } = await service.update(dto);
        console.log(response);
      } catch (e: any) {
        console.log(e);
      }
    });
    //
  });
});
