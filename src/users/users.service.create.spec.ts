import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersCreateInputDto } from './dtos/users.create.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException } from '@nestjs/common';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
            message: 'app_id_required',
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
            message: 'password_required',
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
            message: 'phone_required',
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
      };

      try {
        await service.create(dto);
      } catch (e: any) {
        // console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          // console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'nickname_required',
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
        nickname: 'masterNick',
        confirmPassword: '',
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
            message: 'nickname_required',
            error: 'Bad Request',
          });
        }
      }
    });

    it('app-id conflict, so it fails', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        password: 'qwer!234',
        phone: '01050939902',
        nickname: 'masterNick',
        confirmPassword: '',
      };

      try {
        await service.create(dto);
      } catch (e: any) {
        console.log(e);

        // const { status, response } = jestErrorHandling(e);
        // if (e instanceof BadRequestException) {
        //   expect(status).toStrictEqual(400);
        //
        //   console.log(response);
        //   expect(response).toStrictEqual({
        //     statusCode: 400,
        //     message: 'nickname_required',
        //     error: 'Bad Request',
        //   });
        // }
      }
    });

    it('success should users create', async () => {
      const dto: UsersCreateInputDto = {
        appId: 'master',
        password: 'qwer!234',
        phone: '01050939902',
        nickname: 'masterNick',
        confirmPassword: '',
      };

      const { response } = await service.create(dto);
      console.log(response);
    });
    //
  });
});
