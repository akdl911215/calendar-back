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
} from '../_common/http/errors/400';
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

    const calendar = new CalendarModel();
    calendar.setDelete(dto);

    return await this.repository.delete(calendar.getDelete());
  }

  public async inquiry(
    dto: CalendarInquiryInputDto,
  ): Promise<CalendarInquiryOutputDto> {
    if (!dto?.authorId) throw new BadRequestException(AUTHOR_ID_REQUIRED);
    if (dto?.date < 0) throw new BadRequestException(DATE_REQUIRED);

    const calendar = new CalendarModel();
    calendar.setInquiry(dto);

    return await this.repository.inquiry(calendar.getInquiry());
  }

  public async list(dto: CalendarListInputDto): Promise<CalendarListOutputDto> {
    if (!dto?.authorId) throw new BadRequestException(AUTHOR_ID_REQUIRED);
    if (!dto?.month) throw new BadRequestException(MONTH_REQUIRED);

    const calendar = new CalendarModel();
    calendar.setList(dto);

    return await this.repository.list(calendar.getList());
  }

  public async register(
    dto: CalendarRegisterInputDto,
  ): Promise<CalendarRegisterOutputDto> {
    if (!dto?.authorId) throw new BadRequestException(AUTHOR_ID_REQUIRED);
    if (!dto?.todo) throw new BadRequestException(TODO_REQUIRED);
    if (dto?.date < 0) throw new BadRequestException(DATE_REQUIRED);
    if (dto?.month < 1 || dto?.month > 12)
      throw new BadRequestException(MONTH_REQUIRED);
    if (dto?.day < 1 || dto?.day > 31)
      throw new BadRequestException(DAY_REQUIRED);

    const calendar = new CalendarModel();
    calendar.setRegister(dto);

    return await this.repository.register(calendar.getRegister());
  }

  public async update(
    dto: CalendarUpdateInputDto,
  ): Promise<CalendarUpdateOutputDto> {
    if (!dto?.id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (dto?.date < 0) throw new BadRequestException(DATE_REQUIRED);
    if (dto?.month < 1 || dto?.month > 12)
      throw new BadRequestException(MONTH_REQUIRED);
    if (dto?.day < 1 || dto?.day > 31)
      throw new BadRequestException(DAY_REQUIRED);

    const calendar = new CalendarModel();
    calendar.setUpdate(dto);

    return await this.repository.update(calendar.getUpdate());
  }
}
