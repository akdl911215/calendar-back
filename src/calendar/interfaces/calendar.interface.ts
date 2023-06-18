import {
  CalendarRegisterInputDto,
  CalendarRegisterOutputDto,
} from '../dtos/calendar.register.dto';
import {
  CalendarDeleteInputDto,
  CalendarDeleteOutputDto,
} from '../dtos/calendar.delete.dto';
import {
  CalendarInquiryInputDto,
  CalendarInquiryOutputDto,
} from '../dtos/calendar.inquiry.dto';
import {
  CalendarListInputDto,
  CalendarListOutputDto,
} from '../dtos/calendar.list.dto';
import {
  CalendarUpdateInputDto,
  CalendarUpdateOutputDto,
} from '../dtos/calendar.update.dto';

export interface CalendarInterface {
  readonly register: (
    dto: CalendarRegisterInputDto,
  ) => Promise<CalendarRegisterOutputDto>;

  readonly delete: (
    dto: CalendarDeleteInputDto,
  ) => Promise<CalendarDeleteOutputDto>;

  readonly inquiry: (
    dto: CalendarInquiryInputDto,
  ) => Promise<CalendarInquiryOutputDto>;

  readonly list: (dto: CalendarListInputDto) => Promise<CalendarListOutputDto>;

  readonly update: (
    dto: CalendarUpdateInputDto,
  ) => Promise<CalendarUpdateOutputDto>;
}
