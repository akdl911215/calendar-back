import { Dependencies, Injectable, NotFoundException } from '@nestjs/common';
import { CalendarInterface } from './interfaces/calendar.interface';
import {
  CalendarDeleteInputDto,
  CalendarDeleteOutputDto,
} from './dtos/calendar.delete.dto';
import {
  CalendarInquiryInputDto,
  CalendarInquiryOutputDto,
} from './dtos/calendar.inquiry.dto';
import {
  CalendarListInputDto,
  CalendarListOutputDto,
} from './dtos/calendar.list.dto';
import {
  CalendarRegisterInputDto,
  CalendarRegisterOutputDto,
} from './dtos/calendar.register.dto';
import {
  CalendarUpdateInputDto,
  CalendarUpdateOutputDto,
} from './dtos/calendar.update.dto';
import { Calendar } from '@prisma/client';
import { NOTFOUND_CALENDAR } from '../_common/http/errors/404';
import { errorHandling } from '../_common/dtos/error.handling';
import { PrismaService } from '../_common/prisma/prisma.service';
import { DATE } from '../_common/dtos/get.date';

@Injectable()
@Dependencies([PrismaService])
export class CalendarRepository implements CalendarInterface {
  constructor(private readonly prisma: PrismaService) {}

  public async delete(
    dto: CalendarDeleteInputDto,
  ): Promise<CalendarDeleteOutputDto> {
    const { todo, authorId } = dto;

    const authorIdAndTodoFindByCalendar: Calendar =
      await this.prisma.calendar.findFirst({
        where: { AND: [{ authorId }, { todo }] },
      });
    if (!authorIdAndTodoFindByCalendar)
      throw new NotFoundException(NOTFOUND_CALENDAR);

    try {
      const deleteCalendar: Calendar = await this.prisma.$transaction(
        async () => {
          return await this.prisma.calendar.update({
            where: { id: authorIdAndTodoFindByCalendar.id },
            data: {
              updatedAt: DATE,
            },
          });
        },
      );

      return { response: { calendarErase: !!deleteCalendar } };
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async inquiry(
    dto: CalendarInquiryInputDto,
  ): Promise<CalendarInquiryOutputDto> {
    const { authorId, date } = dto;
    const authorIdAndDateFindByCalendar: Calendar[] =
      await this.prisma.calendar.findMany({
        where: { AND: [{ authorId }, { date }] },
      });

    return { response: { inquiryList: authorIdAndDateFindByCalendar } };
  }

  public async list(dto: CalendarListInputDto): Promise<CalendarListOutputDto> {
    const { authorId, month } = dto;

    const authorIdAndMonthFindByCalendar: Calendar[] =
      await this.prisma.calendar.findMany({
        where: { AND: [{ authorId }, { month }] },
      });

    return { response: { monthList: authorIdAndMonthFindByCalendar } };
  }

  public async register(
    dto: CalendarRegisterInputDto,
  ): Promise<CalendarRegisterOutputDto> {
    const { todo, date, authorId, month, day } = dto;

    try {
      const registerCalendar: Calendar = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendar.create({
            data: {
              todo,
              date,
              authorId,
              month,
              day,
            },
          }),
      );

      return { response: registerCalendar };
    } catch (e: any) {
      errorHandling(e);
    }
  }

  public async update(
    dto: CalendarUpdateInputDto,
  ): Promise<CalendarUpdateOutputDto> {
    const { id, month, day, todo, date, done, authorId } = dto;

    const idFindByCalendar: Calendar = await this.prisma.calendar.findFirst({
      where: { AND: [{ id }, { date }] },
    });
    if (!idFindByCalendar) throw new NotFoundException(NOTFOUND_CALENDAR);

    const updateMonth: number =
      month < 1 || month > 12 ? idFindByCalendar.month : month;

    const updateDay: number = day < 1 || day > 31 ? idFindByCalendar.day : day;

    const updateTodo: string = todo === '' ? idFindByCalendar.todo : todo;

    const updateAuthorId: string =
      authorId === '' ? idFindByCalendar.authorId : authorId;

    try {
      const updateCalendar: Calendar = await this.prisma.$transaction(
        async () => {
          return await this.prisma.calendar.update({
            where: { id },
            data: {
              month: updateMonth,
              day: updateDay,
              todo: updateTodo,
              authorId: updateAuthorId,
              done,
              updatedAt: DATE,
            },
          });
        },
      );

      return { response: updateCalendar };
    } catch (e: any) {
      errorHandling(e);
    }
  }
}
