import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CalendarInterface } from './interfaces/calendar.interface';
import {
  CalendarRegisterInputDto,
  CalendarRegisterOutputDto,
} from './dtos/calendar.register.dto';
import { CREATE_SUCCESS } from '../_common/http/success/201';
import { INTERNAL_SERVER_ERROR } from '../_common/http/errors/500';
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
  AUTHOR_ID_REQUIRED,
  DATE_REQUIRED,
  DAY_REQUIRED,
  MONTH_REQUIRED,
  TODO_REQUIRED,
  TOKEN_NOT_EXIST,
  UNIQUE_ID_REQUIRED,
} from '../_common/http/errors/400';
import { UNAUTHORIZED } from '../_common/http/errors/401';
import { TWO_HUNDRED_OK } from '../_common/http/success/200';
import {
  CalendarUpdateInputDto,
  CalendarUpdateOutputDto,
} from './dtos/calendar.update.dto';
import { User } from '../users/infrastructure/decorator/user.decorator';
import { UsersBaseDto } from '../users/dtos/users.base.dto';
import { AccessTokenGuard } from '../users/infrastructure/token/guards/jwt.access.guard';
import { NOTFOUND_CALENDAR } from '../_common/http/errors/404';
import { DATE_DAY, DATE_MONTH, DATE_YEAR } from '../_common/dtos/get.date';

@ApiTags('calendar')
@Controller('calendar')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('access_token')
export class CalendarController {
  constructor(@Inject('SERVICE') private readonly service: CalendarInterface) {}

  @Post('/register')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'CALENDAR REGISTER API',
    description: '캘린더 등록 절차',
  })
  @ApiResponse({ status: 201, description: `${CREATE_SUCCESS}` })
  @ApiResponse({
    status: 400,
    description: `${TOKEN_NOT_EXIST}, ${AUTHOR_ID_REQUIRED}, ${TODO_REQUIRED}, ${DATE_REQUIRED}, ${MONTH_REQUIRED}, ${DAY_REQUIRED}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({
    type: CalendarRegisterInputDto,
    description: '캘린더 등록 절차에 필요한 값',
  })
  private async register(
    @Body()
    dto: Pick<CalendarRegisterInputDto, 'todo' | 'month' | 'day'>,
    @User() user: Pick<UsersBaseDto, 'id'>,
  ): Promise<CalendarRegisterOutputDto> {
    const { id } = user;
    return await this.service.register({
      ...dto,
      authorId: id,
    });
  }

  @Patch('/delete')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'CALENDAR DELETE API',
    description: '캘린다 삭제 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${TOKEN_NOT_EXIST}, ${AUTHOR_ID_REQUIRED}, ${TODO_REQUIRED}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({
    type: CalendarDeleteInputDto,
    description: '캘린더 삭제 절차에 필요한 값',
  })
  private async delete(
    @Body() dto: Pick<CalendarDeleteInputDto, 'authorId' | 'todo'>,
  ): Promise<CalendarDeleteOutputDto> {
    return await this.service.delete(dto);
  }

  @Patch('/update')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'CALENDAR UPDATE API',
    description: '캘린더 업데이트 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${TOKEN_NOT_EXIST}, ${UNIQUE_ID_REQUIRED}, ${AUTHOR_ID_REQUIRED}, ${MONTH_REQUIRED}, ${DAY_REQUIRED}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 404, description: `${NOTFOUND_CALENDAR}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({
    type: CalendarUpdateInputDto,
    description: '캘린더 업데이트 절차에 필요한 값',
  })
  private async update(
    @Body()
    dto: Pick<CalendarUpdateInputDto, 'todo' | 'done' | 'id' | 'month' | 'day'>,
    @User() user: Pick<UsersBaseDto, 'id'>,
  ): Promise<CalendarUpdateOutputDto> {
    const { id } = user;

    return await this.service.update({ ...dto, authorId: id });
  }

  @Get('/')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'CALENDAR INQUIRY API',
    description: '캘린다 조회 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${TOKEN_NOT_EXIST}, ${AUTHOR_ID_REQUIRED}, ${DATE_REQUIRED}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async inquiry(
    @User() user: Pick<UsersBaseDto, 'id'>,
  ): Promise<CalendarInquiryOutputDto> {
    const { id } = user;
    return await this.service.inquiry({
      month: DATE_MONTH,
      day: DATE_DAY,
      authorId: id,
    });
  }

  @Get('/list')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'CALENDAR LIST INQUIRY API',
    description: '캘린다 리스트 조회 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${TOKEN_NOT_EXIST}, ${AUTHOR_ID_REQUIRED}, ${MONTH_REQUIRED}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async list(
    @Query() dto: Pick<CalendarListInputDto, 'month'>,
    @User() user: Pick<UsersBaseDto, 'id'>,
  ): Promise<CalendarListOutputDto> {
    const { id } = user;

    return await this.service.list({
      authorId: id,
      month: DATE_MONTH,
    });
  }
}
