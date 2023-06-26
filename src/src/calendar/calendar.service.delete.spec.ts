import { CalendarService } from './calendar.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarRepository } from './calendar.repository';
import { CalendarDeleteInputDto } from './dtos/calendar.delete.dto';
import { DATE_TIME } from '../_common/dtos/get.date';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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
            message: 'author_id_required',
            statusCode: 400,
          });
        }
      }
    });

    it('todo empty, so it fails', async () => {
      const dto: CalendarDeleteInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
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
            message: 'todo_required',
            statusCode: 400,
          });
        }
      }
    });

    it(' invalid author-id , so it fails', async () => {
      const dto: CalendarDeleteInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'ddd',
      };

      try {
        await service.delete(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof NotFoundException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(404);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Not Found',
            message: 'calendar',
            statusCode: 404,
          });
        }
      }
    });

    it('calendar delete success', async () => {
      const deleteDto: CalendarDeleteInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: 'delete-todo',
      };

      const dto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        authorId: deleteDto.authorId,
        todo: deleteDto.todo,
        date: 31,
        day: 6,
        month: 6,
        done: true,
        createdAt: DATE_TIME,
        updatedAt: null,
        deletedAt: DATE_TIME,
      };

      jest.spyOn(prisma.calendar, 'update').mockResolvedValue(dto);

      try {
        const { response } = await service.delete(deleteDto);
        console.log(response);
      } catch (e: any) {
        console.log(e);
      }
    });
  });
});
