import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersDeleteInputDto } from './dtos/users.delete.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DATE } from '../_common/dtos/get.date';
import { UNIQUE_ID_REQUIRED } from '../_common/https/errors/400';
import { NOTFOUND_USER } from '../_common/https/errors/404';

describe('Users Delete Process', () => {
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

  describe('user delete unit test', () => {
    it('app-id empty, so it fails', async () => {
      const dto: UsersDeleteInputDto = {
        id: '',
      };

      try {
        await service.delete(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: UNIQUE_ID_REQUIRED,
            error: 'Bad Request',
          });
        }
      }
    });

    it('notfound user, so it fails', async () => {
      const dto: UsersDeleteInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
      };

      jest.spyOn(prisma.calendarUsers, 'findUnique').mockResolvedValue(null);

      try {
        await service.delete(dto);
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

    it('success should user delete', async () => {
      const dto: UsersDeleteInputDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
      };

      const deleteDto = {
        id: dto.id,
        app_id: 'testId',
        password: 'qwer!234',
        phone: '01012312344',
        nickname: 'testNick',
        email: 'akdl911215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: DATE,
      };

      jest
        .spyOn(prisma.calendarUsers, 'findUnique')
        .mockResolvedValue(deleteDto);
      jest.spyOn(prisma.calendarUsers, 'update').mockResolvedValue(deleteDto);

      try {
        const { response } = await service.delete(dto);
        console.log('response : ', response);
      } catch (e: any) {
        console.log(e);
      }
    });
    //
  });
});
