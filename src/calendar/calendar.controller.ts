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
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async register(
    @Body() dto: CalendarRegisterInputDto,
  ): Promise<CalendarRegisterOutputDto> {
    return await this.service.register(dto);
  }

  @Patch('/delete')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'CALENDAR DELETE API',
    description: '캘린다 삭제 절차',
  })
  @ApiResponse({ status: 200, description: `` })
  @ApiResponse({ status: 500, description: `` })
  private async delete(
    @Body() dto: CalendarDeleteInputDto,
  ): Promise<CalendarDeleteOutputDto> {
    return await this.service.delete(dto);
  }

  @Get('/')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'CALENDAR INQUIRY API',
    description: '캘린다 조회 절차',
  })
  @ApiResponse({ status: 200, description: `` })
  @ApiResponse({ status: 500, description: `` })
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
  @ApiResponse({ status: 200, description: `` })
  @ApiResponse({ status: 500, description: `` })
  private async list(
    @Query() dto: CalendarListInputDto,
  ): Promise<CalendarListOutputDto> {
    return await this.service.list(dto);
  }
}
