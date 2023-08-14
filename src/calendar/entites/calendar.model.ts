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

  public set _update(param: CalendarUpdateInputDto) {
    const { id, authorId, todo, done, month, day } = param;

    this._id = { id };
    this.authorId = authorId;
    this.todo = todo;
    this.done = done;
    this.month = month;
    this.day = day;
  }

  public get _update(): {
    readonly id: string;
    readonly authorId: string;
    readonly todo: string;
    readonly done: boolean;
    readonly month: number;
    readonly day: number;
  } {
    return {
      id: super._id.id,
      authorId: this.authorId,
      todo: this.todo,
      done: this.done,
      month: this.month,
      day: this.day,
    };
  }

  public set _register(param: CalendarRegisterInputDto) {
    const { authorId, todo, month, day } = param;

    this.authorId = authorId;
    this.todo = todo;
    this.month = month;
    this.day = day;
  }
  public get _register(): {
    readonly authorId: string;
    readonly todo: string;
    readonly month: number;
    readonly day: number;
  } {
    return {
      authorId: this.authorId,
      todo: this.todo,
      month: this.month,
      day: this.day,
    };
  }

  public set _list(param: CalendarListInputDto) {
    const { authorId, month } = param;

    this.authorId = authorId;
    this.month = month;
  }
  public get _list(): { readonly authorId: string; readonly month: number } {
    return {
      authorId: this.authorId,
      month: this.month,
    };
  }

  public set _inquiry(param: CalendarInquiryInputDto) {
    const { authorId, month, day } = param;

    this.authorId = authorId;
    this.month = month;
    this.day = day;
  }
  public get _inquiry(): {
    readonly authorId: string;
    readonly month: number;
    readonly day: number;
  } {
    return {
      authorId: this.authorId,
      month: this.month,
      day: this.day,
    };
  }

  public set _delete(params: CalendarDeleteInputDto) {
    const { authorId, todo, id } = params;

    this.todo = todo;
    this.authorId = authorId;
    super._id = { id };
  }

  public get _delete(): {
    readonly id: string;
    readonly authorId: string;
    readonly todo: string;
  } {
    return {
      id: this._id.id,
      authorId: this.authorId,
      todo: this.todo,
    };
  }
}
