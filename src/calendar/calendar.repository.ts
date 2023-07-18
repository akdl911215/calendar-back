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
    const { authorId, month, day } = dto;
    const authorIdAndDateFindByCalendar: Calendar[] =
      await this.prisma.calendar.findMany({
        where: {
          AND: [{ authorId }, { month }, { day }],
        },
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
    const { todo, authorId, month, day } = dto;

    try {
      const registerCalendar: Calendar = await this.prisma.$transaction(
        async () =>
          await this.prisma.calendar.create({
            data: {
              todo,
              date: String(DATE),
              authorId,
              month: month,
              day: day,
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
    const { id, month, day, todo, done, authorId } = dto;

    const idFindByCalendar: Calendar = await this.prisma.calendar.findFirst({
      where: {
        AND: [{ id }, { month }, { day }],
      },
    });
    if (!idFindByCalendar) throw new NotFoundException(NOTFOUND_CALENDAR);

    const updateTodo: string = todo === '' ? idFindByCalendar.todo : todo;

    try {
      const updateCalendar: Calendar = await this.prisma.$transaction(
        async () => {
          return await this.prisma.calendar.update({
            where: { id },
            data: {
              month,
              day,
              todo: updateTodo,
              authorId,
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
