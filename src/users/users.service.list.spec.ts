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
import { PAGE_REQUIRED, TAKE_REQUIRED } from '../_common/https/errors/400';

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
            message: TAKE_REQUIRED,
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
            message: PAGE_REQUIRED,
            statusCode: 400,
          });
        }
      }
    });

    it('success should user list', async () => {
      const dto: UsersListInputDto = {
        take: 2,
        page: 1,
      };

      const listDto = {
        id: 'eb999c69-d784-4b2f-a7a5-bbf31172b7c4',
        app_id: 'testId',
        password: 'qwer!234',
        phone: '01012312344',
        nickname: 'testNick',
        email: 'akdl911215@naver.com',
        refresh_token: null,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };
      const listDtoArr = [listDto, listDto];
      const responseList = listDtoArr.map((el) => {
        return {
          id: el.id,
          app_id: el.app_id,
          nickname: el.nickname,
          email: el.email,
          phone: el.phone,
          created_at: el.created_at,
        };
      });

      const countMock = jest
        .spyOn(prisma.calendarUsers, 'count')
        .mockResolvedValue(2);

      const findManyMock = jest
        .spyOn(prisma.calendarUsers, 'findMany')
        .mockResolvedValue(listDtoArr);

      try {
        const { response } = await service.list(dto);
        console.log('response.current_list : ', response.current_list);

        expect(countMock).toHaveBeenCalledTimes(1);
        expect(findManyMock).toHaveBeenCalledTimes(1);
        expect(response.current_list).toStrictEqual(responseList);
        expect(response.total_take).toStrictEqual(2);
        expect(response.total_pages).toStrictEqual(1);
        expect(response.current_page).toStrictEqual(1);
      } catch (e: any) {
        console.log(e);
      }
    });
    //
  });
});
