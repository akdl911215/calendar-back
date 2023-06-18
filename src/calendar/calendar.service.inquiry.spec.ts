import { CalendarService } from './calendar.service';
import { PrismaService } from '../_common/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CalendarRepository } from './calendar.repository';
import { CalendarInquiryInputDto } from './dtos/calendar.inquiry.dto';
import { DATE_TIME } from '../_common/dtos/get.date';
import { Calendar } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { jestErrorHandling } from '../_common/dtos/jest.error.handling';

describe('Calendar Inquiry Process', () => {
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

  describe('calendar inquiry unit test', () => {
    it('author-id empty, so it fails', async () => {
      const dto: CalendarInquiryInputDto = {
        authorId: '',
        date: 0,
      };

      try {
        await service.inquiry(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

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

    it('date < 0, so it fails', async () => {
      const dto: CalendarInquiryInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        date: -1,
      };

      try {
        await service.inquiry(dto);
      } catch (e: any) {
        console.log(e);

        if (e instanceof BadRequestException) {
          const { status, response } = jestErrorHandling(e);

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

    it('calendar inquiry success', async () => {
      const inquiryDto: CalendarInquiryInputDto = {
        authorId: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        date: 0,
      };

      const dto = {
        id: '8654f7b1-d588-4c2b-87a3-124365f13cc1',
        authorId: inquiryDto.authorId,
        todo: '',
        date: inquiryDto.date,
        day: 0,
        month: 0,
        done: true,
        createdAt: DATE_TIME,
        updatedAt: null,
        deletedAt: null,
      };

      const inquiryDtoArr: Calendar[] = [dto];

      jest.spyOn(prisma.calendar, 'findMany').mockResolvedValue(inquiryDtoArr);

      try {
        const {
          response: { inquiryList },
        } = await service.inquiry(inquiryDto);
        console.log('inquiryList : ', inquiryList);

        expect(inquiryList).toStrictEqual(inquiryDtoArr);
      } catch (e: any) {
        console.log(e);
      }
    });
  });
});
