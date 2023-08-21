import { CalendarService } from './calendar.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarRepository } from './calendar.repository';
import { CalendarUpdateInputDto } from './dtos/calendar.update.dto';
import { DATE } from '../_common/dtos/get.date';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';

describe('Calendar Update Process', () => {
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

  describe('calendar update unit test', () => {
    it('id empty, so it fails', async () => {
      const dto: CalendarUpdateInputDto = {
        id: '',
        todo: '',
        day: 0,
        month: 0,
        done: true,
        authorId: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'unique_id_required',
            statusCode: 400,
          });
        }
      }
    });

    it('date < 0, so it fails', async () => {
      const dto: CalendarUpdateInputDto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        day: 0,
        month: 0,
        done: true,
        authorId: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'date_required',
            statusCode: 400,
          });
        }
      }
    });

    it('month < 1, so it fails', async () => {
      const dto: CalendarUpdateInputDto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        day: 0,
        month: 0,
        done: true,
        authorId: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'month_required',
            statusCode: 400,
          });
        }
      }
    });

    it('month > 13, so it fails', async () => {
      const dto: CalendarUpdateInputDto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        day: 0,
        month: 13,
        done: true,
        authorId: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'month_required',
            statusCode: 400,
          });
        }
      }
    });

    it('day < 1, so it fails', async () => {
      const dto: CalendarUpdateInputDto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        day: 0,
        month: 1,
        done: true,
        authorId: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'day_required',
            statusCode: 400,
          });
        }
      }
    });

    it('day > 31, so it fails', async () => {
      const dto: CalendarUpdateInputDto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        day: 32,
        month: 1,
        done: true,
        authorId: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(400);

          console.log(response);
          expect(response).toStrictEqual({
            error: 'Bad Request',
            message: 'day_required',
            statusCode: 400,
          });
        }
      }
    });

    it('invalid id, so it fails', async () => {
      const dto: CalendarUpdateInputDto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        day: 30,
        month: 1,
        done: true,
        authorId: '',
      };

      try {
        await service.update(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof NotFoundException) {
          const { status, response } = jestErrorHandling(e);

          expect(status).toStrictEqual(404);

          console.log(response);
          expect(response).toStrictEqual({
            statusCode: 404,
            message: 'calendar',
            error: 'Not Found',
          });
        }
      }
    });

    it('calendar update success', async () => {
      const updateDto: CalendarUpdateInputDto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        todo: '',
        day: 1,
        month: 1,
        done: true,
        authorId: 'authorId',
      };

      const dto = {
        id: updateDto.id,
        author_id: updateDto.authorId,
        todo: '',
        date: '',
        day: updateDto.day,
        month: updateDto.month,
        done: true,
        created_at: DATE,
        updated_at: DATE,
        deleted_at: null,
      };

      jest.spyOn(prisma.calendar, 'findFirst').mockResolvedValue(dto);
      jest.spyOn(prisma.calendar, 'update').mockResolvedValue(dto);

      try {
        const response = await service.update(updateDto);
        console.log(response);
      } catch (e: any) {
        console.log(e);
      }
    });
  });
});
