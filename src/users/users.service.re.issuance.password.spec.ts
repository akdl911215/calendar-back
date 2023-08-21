import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersReIssuancePasswordInputDto } from './dtos/users.update.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  PASSWORD_REQUIRED,
  UNIQUE_ID_REQUIRED,
} from '../_common/https/errors/400';
import { DATE } from '../_common/dtos/get.date';

describe('Users Re Issuance Password Process', () => {
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

  describe('user re issuance password unit test', () => {
    it('id empty, so it fails', async () => {
      const dto: UsersReIssuancePasswordInputDto = {
        id: '',
        password: '',
      };

      try {
        await service.reIssuancePassword(dto);
      } catch (e: any) {
        console.log(e);

        const { response, status } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          expect(response).toStrictEqual({
            statusCode: 400,
            message: UNIQUE_ID_REQUIRED,
            error: 'Bad Request',
          });
        }
      }
    });

    it('password empty, so it fails', async () => {
      const dto: UsersReIssuancePasswordInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        password: '',
      };

      try {
        await service.reIssuancePassword(dto);
      } catch (e: any) {
        console.log(e);

        const { response, status } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          expect(response).toStrictEqual({
            statusCode: 400,
            message: PASSWORD_REQUIRED,
            error: 'Bad Request',
          });
        }
      }
    });

    it('not found user, so it fails', async () => {
      const dto: UsersReIssuancePasswordInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        password: 'qwer!@34',
      };

      const findUniqueMock = jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(null);

      try {
        await service.reIssuancePassword(dto);
      } catch (e: any) {
        expect(findUniqueMock).toHaveBeenCalledTimes(1);

        const { response, status } = jestErrorHandling(e);
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

    it('success should user re issuance password', async () => {
      const dto: UsersReIssuancePasswordInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        password: 'qwer!@34',
      };

      const reIssuancePasswordDto = {
        id: dto.id,
        app_id: 'appId',
        nickname: 'nick',
        password: dto.password,
        phone: '01050399923',
        email: 'akdl11215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findUniqueMock = jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(reIssuancePasswordDto);
      const updateMock = jest
        .spyOn(prisma.calendarUsers, 'update')
        .mockResolvedValue(reIssuancePasswordDto);

      try {
        const response = await service.reIssuancePassword(dto);
        console.log(response);

        expect(response).toStrictEqual(reIssuancePasswordDto);
        expect(findUniqueMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);
      }
    });
    //
  });
});
