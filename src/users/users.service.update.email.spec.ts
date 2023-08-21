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
import { UsersUpdateEmailInputDto } from './dtos/users.update.dto';
import {
  EMAIL_REQUIRED,
  UNIQUE_ID_REQUIRED,
} from '../_common/https/errors/400';
import { NOTFOUND_USER } from '../_common/https/errors/404';
import { ALREADY_EMAIL } from '../_common/https/errors/409';

describe('Users Update Email Process', () => {
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

  describe('user email update unit test', () => {
    it('id empty, so it fails', async () => {
      const dto: UsersUpdateEmailInputDto = {
        id: '',
        email: '',
      };

      try {
        await service.updateEmail(dto);
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

    it('email empty, so it fails', async () => {
      const dto: UsersUpdateEmailInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        email: '',
      };

      try {
        await service.updateEmail(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: EMAIL_REQUIRED,
            statusCode: 400,
          });
        }
      }
    });

    it('user find by id and email not-found, so it fails', async () => {
      const dto: UsersUpdateEmailInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        email: 'akdl911215@naver.com',
      };

      const findByIdDto = {
        id: dto.id,
        app_id: 'ddd',
        nickname: 'sss',
        password: 'qwer!234',
        phone: '111',
        email: 'akdl911211@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findUniqueMock = jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(findByIdDto);

      const findFirstMock = jest
        .spyOn(prisma.calendarUsers, 'findFirst')
        .mockResolvedValue(null);

      try {
        await service.updateEmail(dto);

        expect(findUniqueMock).toHaveBeenCalledTimes(1);
        expect(findFirstMock).toHaveBeenCalledTimes(1);
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

    it('already email, so it fails', async () => {
      const dto: UsersUpdateEmailInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        email: 'akdl911215@naver.com',
      };

      const findUniqueDto = {
        id: dto.id,
        app_id: 'ddd',
        nickname: 'sss',
        password: 'qwer!234',
        phone: '111',
        email: dto.email,
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findUniqueMock = jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(findUniqueDto);

      try {
        await service.updateEmail(dto);

        expect(findUniqueMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof ConflictException) {
          expect(status).toStrictEqual(409);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 409,
            message: ALREADY_EMAIL,
            error: 'Conflict',
          });
        }
      }
    });

    it('success should user email update', async () => {
      const dto: UsersUpdateEmailInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        email: 'testNick',
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
        nickname: dto.email,
        email: 'akdl911211@naver.com',
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
        const { response } = await service.updateEmail(dto);
        console.log('response', response);

        expect(response).toStrictEqual(updateDto);
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
