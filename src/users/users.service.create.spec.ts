import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersCreateInputDto } from './dtos/users.create.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DATE } from '../_common/dtos/get.date';
import {
  APP_ID_REQUIRED,
  EMAIL_REQUIRED,
  NICKNAME_REQUIRED,
  PASSWORD_REQUIRED,
  PHONE_REQUIRED,
} from '../_common/http/errors/400';
import { ALREADY_USER } from '../_common/http/errors/409';

describe('Users Create Process', () => {
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

  describe('user create unit test', () => {
    it('app-id empty, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: '',
        password: '',
        nickname: '',
        confirmPassword: '',
        phone: '',
        email: 'akdl911215@naver.com',
      };

      try {
        await service.create(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: APP_ID_REQUIRED,
            error: 'Bad Request',
          });
        }
      }
    });

    it('password empty, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        password: '',
        nickname: '',
        confirmPassword: '',
        phone: '',
        email: 'akdl911215@naver.com',
      };

      try {
        await service.create(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: PASSWORD_REQUIRED,
            error: 'Bad Request',
          });
        }
      }
    });

    it('phone empty, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        password: 'qwer!234',
        phone: '',
        nickname: '',
        confirmPassword: '',
        email: 'akdl911215@naver.com',
      };

      try {
        await service.create(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: PHONE_REQUIRED,
            error: 'Bad Request',
          });
        }
      }
    });

    it('nickname empty, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        password: 'qwer!234',
        phone: '01050939902',
        nickname: '',
        confirmPassword: '',
        email: 'akdl911215@naver.com',
      };

      try {
        await service.create(dto);
      } catch (e: any) {
        console.log('nickname : ', e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: NICKNAME_REQUIRED,
            error: 'Bad Request',
          });
        }
      }
    });

    it('email empty, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        password: 'qwer!234',
        phone: '01050939902',
        nickname: 'aaaa',
        confirmPassword: '',
        email: '',
      };

      try {
        await service.create(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: EMAIL_REQUIRED,
            error: 'Bad Request',
          });
        }
      }
    });

    it('app-id conflict, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        phone: '01050939902',
        nickname: 'masterNick',
        email: 'akdl911215@naver.com',
        password: 'qwer!234',
        confirmPassword: '',
      };

      const findUniqueDto = {
        id: '',
        app_id: dto.appId,
        nickname: '11',
        phone: '22',
        email: '33',
        password: dto.password,
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findFirstMock = jest
        .spyOn(prisma.calendarUsers, 'findFirst')
        .mockResolvedValue(findUniqueDto);

      try {
        await service.create(dto);

        expect(findFirstMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof ConflictException) {
          expect(status).toStrictEqual(409);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 409,
            message: ALREADY_USER,
            error: 'Conflict',
          });
        }
      }
    });

    it('phone conflict, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        phone: '01050939902',
        nickname: 'masterNick',
        email: 'akdl911215@naver.com',
        password: 'qwer!234',
        confirmPassword: '',
      };

      const findUniqueDto = {
        id: '',
        app_id: '22',
        nickname: '11',
        phone: dto.phone,
        email: '33',
        password: dto.password,
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findFirstMock = jest
        .spyOn(prisma.calendarUsers, 'findFirst')
        .mockResolvedValue(findUniqueDto);

      try {
        await service.create(dto);

        expect(findFirstMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof ConflictException) {
          expect(status).toStrictEqual(409);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 409,
            message: ALREADY_USER,
            error: 'Conflict',
          });
        }
      }
    });

    it('nickname conflict, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        phone: '01050939902',
        nickname: 'masterNick',
        email: 'akdl911215@naver.com',
        password: 'qwer!234',
        confirmPassword: '',
      };

      const findUniqueDto = {
        id: '',
        app_id: '22',
        nickname: dto.nickname,
        phone: '11',
        email: '33',
        password: dto.password,
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findFirstMock = jest
        .spyOn(prisma.calendarUsers, 'findFirst')
        .mockResolvedValue(findUniqueDto);

      try {
        await service.create(dto);

        expect(findFirstMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof ConflictException) {
          expect(status).toStrictEqual(409);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 409,
            message: ALREADY_USER,
            error: 'Conflict',
          });
        }
      }
    });

    it('email conflict, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        phone: '01050939902',
        nickname: 'masterNick',
        email: 'akdl911215@naver.com',
        password: 'qwer!234',
        confirmPassword: '',
      };

      const findUniqueDto = {
        id: '',
        app_id: '22',
        nickname: '33',
        phone: '11',
        email: dto.email,
        password: dto.password,
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findFirstMock = jest
        .spyOn(prisma.calendarUsers, 'findFirst')
        .mockResolvedValue(findUniqueDto);

      try {
        await service.create(dto);

        expect(findFirstMock).toHaveBeenCalledTimes(1);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof ConflictException) {
          expect(status).toStrictEqual(409);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 409,
            message: ALREADY_USER,
            error: 'Conflict',
          });
        }
      }
    });

    it('success should users create', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        password: 'qwer!234',
        phone: '01050939902',
        nickname: 'masterNick',
        confirmPassword: '',
        email: 'akdl911215@naver.com',
      };

      const createDto = {
        id: '',
        app_id: dto.appId,
        password: dto.password,
        phone: dto.phone,
        nickname: dto.nickname,
        email: dto.email,
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      const findFirstMock = jest
        .spyOn(prisma.calendarUsers, 'findFirst')
        .mockResolvedValue(null);
      const createMock = jest
        .spyOn(prisma.calendarUsers, 'create')
        .mockResolvedValue(createDto);

      const { response } = await service.create(dto);
      console.log(response);

      expect(findFirstMock).toHaveBeenCalledTimes(1);
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(response).toStrictEqual(createDto);
    });
    //
  });
});
