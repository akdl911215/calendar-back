import { CalendarService } from './calendar.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarRegisterInputDto } from './dtos/calendar.register.dto';
import { DATE_TIME } from '../_common/dtos/get.date';
import { CalendarRepository } from './calendar.repository';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException } from '@nestjs/common';

describe('Calendar Register Process', () => {
  let service: CalendarService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
          provide: 'REPOSITORY',
          useClass: CalendarRepository,
        },
        PrismaService,
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('calendar register unit test', () => {
    it('author-id empty, so it fails', async () => {
      const dto: CalendarRegisterInputDto = {
        authorId: '',
        todo: '',
        date: 0,
        month: 0,
        day: 0,
      };

      try {
        await service.register(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'author_id_required',
            error: 'Bad Request',
          });
        }
      }
    });

    it('todo empty, so it fails', async () => {
      const dto: CalendarRegisterInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        date: 0,
        month: 0,
        day: 0,
      };

      try {
        await service.register(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'todo_required',
            error: 'Bad Request',
          });
        }
      }
    });

    it('date < 0, so it fails', async () => {
      const dto: CalendarRegisterInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'todo-test',
        date: -1,
        month: 0,
        day: 0,
      };

      try {
        await service.register(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'date_required',
            error: 'Bad Request',
          });
        }
      }
    });

    it('month < 1, so it fails', async () => {
      const dto: CalendarRegisterInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'todo-test',
        date: 0,
        month: 0,
        day: 0,
      };

      try {
        await service.register(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'month_required',
            error: 'Bad Request',
          });
        }
      }
    });

    it('month > 12, so it fails', async () => {
      const dto: CalendarRegisterInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'todo-test',
        date: 0,
        month: 0,
        day: 0,
      };

      try {
        await service.register(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'month_required',
            error: 'Bad Request',
          });
        }
      }
    });

    it('day < 1, so it fails', async () => {
      const dto: CalendarRegisterInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'todo-test',
        date: 0,
        month: 1,
        day: 0,
      };

      try {
        await service.register(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'day_required',
            error: 'Bad Request',
          });
        }
      }
    });

    it('day > 31, so it fails', async () => {
      const dto: CalendarRegisterInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'todo-test',
        date: 0,
        month: 1,
        day: 32,
      };

      try {
        await service.register(dto);
      } catch (e: any) {
        console.log(e);

        const { status, response } = jestErrorHandling(e);
        if (e instanceof BadRequestException) {
          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 400,
            message: 'day_required',
            error: 'Bad Request',
          });
        }
      }
    });

    it('calendar register success', async () => {
      const registerDto: CalendarRegisterInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'todo',
        day: 31,
        date: 12345,
        month: 5,
      };

      const dto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        authorId: registerDto.authorId,
        todo: registerDto.todo,
        date: registerDto.date,
        day: registerDto.day,
        month: registerDto.month,
        done: true,
        createdAt: DATE_TIME,
        updatedAt: null,
        deletedAt: null,
      };

      jest.spyOn(prisma.calendar, 'create').mockResolvedValue(dto);

      try {
        const { response } = await service.register(registerDto);
        console.log('response : ', response);

        expect(response).toStrictEqual(dto);
      } catch (e: any) {
        console.log(e);
      }
    });
  });
});
