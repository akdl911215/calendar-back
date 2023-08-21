import { CalendarService } from './calendar.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarRepository } from './calendar.repository';
import { CalendarDeleteInputDto } from './dtos/calendar.delete.dto';
import { DATE } from '../_common/dtos/get.date';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  AUTHOR_ID_REQUIRED,
  TODO_REQUIRED,
  UNIQUE_ID_REQUIRED,
} from '../_common/https/errors/400';
import { NOTFOUND_CALENDAR } from '../_common/https/errors/404';

describe('Calendar Delete Process', () => {
  let service: CalendarService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        { provide: 'REPOSITORY', useClass: CalendarRepository },
        PrismaService,
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('calendar delete unit test', () => {
    it('author-id empty, so it fails', async () => {
      const dto: CalendarDeleteInputDto = {
        authorId: '',
        todo: '',
        id: '',
      };

      try {
        await service.delete(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: AUTHOR_ID_REQUIRED,
            statusCode: 400,
          });
        }
      }
    });

    it('todo empty, so it fails', async () => {
      const dto: CalendarDeleteInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        id: '',
      };

      try {
        await service.delete(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: TODO_REQUIRED,
            statusCode: 400,
          });
        }
      }
    });

    it('id empty, so it fails', async () => {
      const dto: CalendarDeleteInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'asdasd',
        id: '',
      };

      try {
        await service.delete(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

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

    it('not found calendar, so it fails', async () => {
      const dto: CalendarDeleteInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'ddd',
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
      };

      const findFirstMock = jest
        .spyOn(prisma.calendar, 'findFirst')
        .mockResolvedValue(null);

      try {
        await service.delete(dto);
      } catch (e: any) {
        console.log(e);

        expect(findFirstMock).toHaveBeenCalledTimes(1);
        if (e instanceof NotFoundException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(404);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Not Found',
            message: NOTFOUND_CALENDAR,
            statusCode: 404,
          });
        }
      }
    });

    it('calendar delete success', async () => {
      const deleteDto: CalendarDeleteInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'delete-todo',
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
      };

      const dto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        author_id: deleteDto.authorId,
        todo: deleteDto.todo,
        done: true,
        date: '',
        day: 6,
        month: 6,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: DATE,
      };
      const findFirstMock = jest
        .spyOn(prisma.calendar, 'findFirst')
        .mockResolvedValue(dto);
      const softDeleteMock = jest
        .spyOn(prisma.calendar, 'update')
        .mockResolvedValue(dto);

      try {
        const response = await service.delete(deleteDto);
        console.log(response);

        expect(findFirstMock).toHaveBeenCalledTimes(1);
        expect(softDeleteMock).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual(dto);
      } catch (e: any) {
        console.log(e);
      }
    });
  });
});
