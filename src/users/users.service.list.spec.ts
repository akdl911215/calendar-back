import { UsersService } from './users.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { HashEncodedService } from './infrastructure/bcrypt/hash.encoded.service';
import { HashDecodedService } from './infrastructure/bcrypt/hash.decoded.service';
import { TokenService } from './infrastructure/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersListInputDto } from './dtos/users.list.dto';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException } from '@nestjs/common';
import { DATE } from '../_common/dtos/get.date';

describe('Users List Process', () => {
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

  describe('user list unit test', () => {
    it('take < 1, so it fails', async () => {
      const dto: UsersListInputDto = {
        take: 0,
        page: 0,
      };

      try {
        await service.list(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'take_required',
            statusCode: 400,
          });
        }
      }
    });

    it('page < 1, so it fails', async () => {
      const dto: UsersListInputDto = {
        take: 1,
        page: 0,
      };

      try {
        await service.list(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'page_required',
            statusCode: 400,
          });
        }
      }
    });

    it('success should user list', async () => {
      const dto: UsersListInputDto = {
        take: 1,
        page: 1,
      };

      const listDtoArr = [
        {
          id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
          appId: 'testId',
          password: 'qwer!234',
          phone: '01012312344',
          nickname: 'testNick',
          refreshToken: null,
          createdAt: DATE,
          updatedAt: DATE,
          deletedAt: null,
        },
      ];

      jest.spyOn(prisma.users, 'findMany').mockResolvedValue(listDtoArr);

      try {
        const { response } = await service.list(dto);
        console.log(response);

        expect(response.currentList).toStrictEqual(listDtoArr);
        expect(response.totalTake).toStrictEqual(1);
        expect(response.totalPages).toStrictEqual(1);
        expect(response.currentPage).toStrictEqual(1);
      } catch (e: any) {
        console.log(e);
      }
    });
    //
  });
});
