import { BaseCommonCoreDto } from '../../_common/dtos/base.common.core.dto';
import { CalendarUpdateInputDto } from '../dtos/calendar.update.dto';
import { CalendarRegisterInputDto } from '../dtos/calendar.register.dto';
import { CalendarListInputDto } from '../dtos/calendar.list.dto';
import { CalendarInquiryInputDto } from '../dtos/calendar.inquiry.dto';
import { CalendarDeleteInputDto } from '../dtos/calendar.delete.dto';

export class CalendarModel extends BaseCommonCoreDto {
  private authorId!: string;
  private date!: string;
  private todo!: string;
  private done!: boolean;
  private month!: number;
  private day!: number;

  public setUpdate(param: CalendarUpdateInputDto): void {
    const { id, authorId, todo, done, month, day } = param;

    this.setId(id);
    this.authorId = authorId;
    this.todo = todo;
    this.done = done;
    this.month = month;
    this.day = day;
  }

  public getUpdate(): {
    id: string;
    authorId: string;
    todo: string;
    done: boolean;
    month: number;
    day: number;
  } {
    return {
      id: super.getId(),
      authorId: this.authorId,
      todo: this.todo,
      done: this.done,
      month: this.month,
      day: this.day,
    };
  }

  public setRegister(param: CalendarRegisterInputDto): void {
    const { authorId, todo, month, day } = param;

    this.authorId = authorId;
    this.todo = todo;
    this.month = month;
    this.day = day;
  }
  public getRegister(): {
    authorId: string;
    todo: string;
    month: number;
    day: number;
  } {
    return {
      authorId: this.authorId,
      todo: this.todo,
      month: this.month,
      day: this.day,
    };
  }

  public setList(param: CalendarListInputDto): void {
    const { authorId, month } = param;

    this.authorId = authorId;
    this.month = month;
  }
  public getList(): { authorId: string; month: number } {
    return {
      authorId: this.authorId,
      month: this.month,
    };
  }

  public setInquiry(param: CalendarInquiryInputDto): void {
    const { authorId, month, day } = param;

    this.authorId = authorId;
    this.month = month;
    this.day = day;
  }
  public getInquiry(): { authorId: string; month: number; day: number } {
    return {
      authorId: this.authorId,
      month: this.month,
      day: this.day,
    };
  }

  public setDelete(param: CalendarDeleteInputDto): void {
    const { authorId, todo } = param;

    this.todo = todo;
    this.authorId = authorId;
  }
  public getDelete(): { todo: string; authorId: string } {
    return {
      todo: this.todo,
      authorId: this.authorId,
    };
  }
}
