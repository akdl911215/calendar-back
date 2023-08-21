import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
import {
  AUTHOR_ID_REQUIRED,
  DATE_REQUIRED,
  DAY_REQUIRED,
  MONTH_REQUIRED,
  TODO_REQUIRED,
  UNIQUE_ID_REQUIRED,
} from '../_common/https/errors/400';
import { CalendarModel } from './entites/calendar.model';

@Injectable()
export class CalendarService implements CalendarInterface {
  constructor(
    @Inject('REPOSITORY') private readonly repository: CalendarInterface,
  ) {}

  public async delete(
    dto: CalendarDeleteInputDto,
  ): Promise<CalendarDeleteOutputDto> {
    if (!dto?.authorId) throw new BadRequestException(AUTHOR_ID_REQUIRED);
    if (!dto?.todo) throw new BadRequestException(TODO_REQUIRED);
    if (!dto?.id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const calendar = new CalendarModel();
    calendar._delete = dto;

    return await this.repository.delete(calendar._delete);
  }

  public async inquiry(
    dto: CalendarInquiryInputDto,
  ): Promise<CalendarInquiryOutputDto> {
    if (!dto?.authorId) throw new BadRequestException(AUTHOR_ID_REQUIRED);
    if (dto?.month < 0) throw new BadRequestException(DATE_REQUIRED);
    if (dto?.day < 0) throw new BadRequestException(DAY_REQUIRED);

    const calendar = new CalendarModel();
    calendar._inquiry = dto;

    return await this.repository.inquiry(calendar._inquiry);
  }

  public async list(dto: CalendarListInputDto): Promise<CalendarListOutputDto> {
    if (!dto?.authorId) throw new BadRequestException(AUTHOR_ID_REQUIRED);
    if (!dto?.month) throw new BadRequestException(MONTH_REQUIRED);

    const calendar = new CalendarModel();
    calendar._list = dto;

    return await this.repository.list(calendar._list);
  }

  public async register(
    dto: CalendarRegisterInputDto,
  ): Promise<CalendarRegisterOutputDto> {
    if (!dto?.authorId) throw new BadRequestException(AUTHOR_ID_REQUIRED);
    if (!dto?.todo) throw new BadRequestException(TODO_REQUIRED);
    if (dto?.month < 1 || dto?.month > 12)
      throw new BadRequestException(MONTH_REQUIRED);
    if (dto?.day < 1 || dto?.day > 31)
      throw new BadRequestException(DAY_REQUIRED);

    const calendar = new CalendarModel();
    calendar._register = dto;

    return await this.repository.register(calendar._register);
  }

  public async update(
    dto: CalendarUpdateInputDto,
  ): Promise<CalendarUpdateOutputDto> {
    if (!dto?.id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!dto?.authorId) throw new BadRequestException(AUTHOR_ID_REQUIRED);
    if (dto?.month < 1 || dto?.month > 12)
      throw new BadRequestException(MONTH_REQUIRED);
    if (dto?.day < 1 || dto?.day > 31)
      throw new BadRequestException(DAY_REQUIRED);

    const calendar = new CalendarModel();
    calendar._update = dto;

    return await this.repository.update(calendar._update);
  }
}
