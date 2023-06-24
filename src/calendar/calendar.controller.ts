import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
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
} from '../_common/http/errors/400';
import { UNAUTHORIZED } from '../_common/http/errors/401';
import { TWO_HUNDRED_OK } from '../_common/http/success/200';

@ApiTags('calendar')
@Controller('calendar')
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
    dto: Pick<
      CalendarRegisterInputDto,
      'authorId' | 'date' | 'todo' | 'month' | 'day'
    >,
  ): Promise<CalendarRegisterOutputDto> {
    return await this.service.register(dto);
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
    @Query() dto: CalendarInquiryInputDto,
  ): Promise<CalendarInquiryOutputDto> {
    return await this.service.inquiry(dto);
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
    @Query() dto: CalendarListInputDto,
  ): Promise<CalendarListOutputDto> {
    return await this.service.list(dto);
  }
}
