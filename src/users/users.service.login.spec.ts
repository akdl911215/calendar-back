import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersLoginInputDto } from './dtos/users.login.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException } from '@nestjs/common';
import { DATE } from '../_common/dtos/get.date';

describe('Users Login Process', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let decode: HashDecodedService;

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
        HashDecodedService,
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
    decode = module.get<HashDecodedService>(HashDecodedService);
  });

  describe('user login unit test', () => {
    it('app-id empty, so it fails', async () => {
      const dto: UsersLoginInputDto = {
        appId: '',
        password: '',
      };

      try {
        await service.login(dto);
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

    it('password empty, so it fails', async () => {
      const dto: UsersLoginInputDto = {
        appId: 'aaa',
        password: '',
      };

      try {
        await service.login(dto);
      } catch (e: any) {
        // console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          // console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'password_required',
            statusCode: 400,
          });
        }
      }
    });

    it('password empty, so it fails', async () => {
      const dto: UsersLoginInputDto = {
        appId: 'aaa',
        password: 'qwer!234',
      };

      jest.spyOn(prisma.calendarUsers, 'findUnique').mockResolvedValue(null);
      try {
        await service.login(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'no_match_app_id',
            error: 'Bad Request',
          });
        }
      }
    });

    it('user not found, so it fails', async () => {
      const dto: UsersLoginInputDto = {
        appId: 'aaa',
        password: 'qwer!234',
      };

      jest.spyOn(prisma.calendarUsers, 'findUnique').mockResolvedValue(null);

      try {
        await service.login(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'no_match_app_id',
            error: 'Bad Request',
          });
        }
      }
    });

    it('success should user login', async () => {
      const dto: UsersLoginInputDto = {
        appId: 'master',
        password: 'qwer!234',
      };

      const loginDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        app_id: 'master',
        password: 'qwer!234',
        phone: '01012312344',
        nickname: 'testNick',
        email: 'akdl911215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findUniqueMock = jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(loginDto);

      const decodeMock = jest
        .spyOn(decode, 'decoded')
        .mockResolvedValue({ response: { decoded: true } });

      try {
        const { response } = await service.login(dto);
        console.log(response);

        expect(decodeMock).toHaveBeenCalledTimes(1);
        expect(findUniqueMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);
      }
    });
    //
  });
});
