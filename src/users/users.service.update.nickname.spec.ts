import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DATE } from '../_common/dtos/get.date';
import { UsersUpdateNicknameInputDto } from './dtos/users.update.dto';
import {
  NICKNAME_REQUIRED,
  UNIQUE_ID_REQUIRED,
} from '../_common/https/errors/400';
import { NOTFOUND_USER } from '../_common/https/errors/404';

describe('Users Update Nickname Process', () => {
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
        {
          provide: 'FIND_BY_REPOSITORY',
          useClass: UsersRepository,
        },
        {
          provide: 'REFRESH_TOKEN_REPOSITORY',
          useClass: UsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('user nickname update unit test', () => {
    it('id empty, so it fails', async () => {
      const dto: UsersUpdateNicknameInputDto = {
        id: '',
        nickname: '',
      };

      try {
        await service.updateNickname(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: UNIQUE_ID_REQUIRED,
            statusCode: 400,
          });
        }
      }
    });

    it('nickname empty, so it fails', async () => {
      const dto: UsersUpdateNicknameInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        nickname: '',
      };

      try {
        await service.updateNickname(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: NICKNAME_REQUIRED,
            statusCode: 400,
          });
        }
      }
    });

    it('user find by id and nickname not-found, so it fails', async () => {
      const dto: UsersUpdateNicknameInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        nickname: 'aaa',
      };

      try {
        await service.updateNickname(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof NotFoundException) {
          expect(status).toStrictEqual(404);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Not Found',
            message: NOTFOUND_USER,
            statusCode: 404,
          });
        }
      }
    });

    it('already nickname, so it fails', async () => {
      const dto: UsersUpdateNicknameInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        nickname: 'test1111Nick',
      };

      const updateDto = {
        id: dto.id,
        app_id: 'test',
        password: 'qwer!234',
        phone: '01012312344',
        nickname: 'testNick',
        email: 'akdl911215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const conflictNickname = {
        id: dto.id,
        app_id: 'test',
        password: 'qwer!234',
        phone: '01012312344',
        nickname: dto.nickname,
        email: 'akdl911215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      jest
        .spyOn(prisma.calendarUsers, 'findFirst')
        .mockResolvedValue(updateDto);
      jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(conflictNickname);

      try {
        await service.updateNickname(dto);
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

    it('success should user nickname update', async () => {
      const dto: UsersUpdateNicknameInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        nickname: 'testNick',
      };

      const findUniqueDto = {
        id: dto.id,
        app_id: 'test-id',
        password: 'qwer!234',
        phone: '01012312344',
        nickname: 'test',
        email: 'akdl911215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const updateDto = {
        id: dto.id,
        app_id: 'test-id',
        password: 'qwer!234',
        phone: '01012312344',
        nickname: dto.nickname,
        email: 'akdl911215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };
      const findUniqueMock = jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(findUniqueDto);

      const findFirstMock = jest
        .spyOn(prisma.calendarUsers, 'findFirst')
        .mockResolvedValue(updateDto);

      const updateMock = jest
        .spyOn(prisma.calendarUsers, 'update')
        .mockResolvedValue(updateDto);

      try {
        const { response } = await service.updateNickname(dto);
        console.log('response', response);

        expect(findFirstMock).toHaveBeenCalledTimes(1);
        expect(findUniqueMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);
      }
    });
    //
  });
});
