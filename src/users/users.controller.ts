import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersInterface } from './interfaces/users.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CREATE_SUCCESS, LOGIN_SUCCESS } from '../_common/http/success/201';
import { INTERNAL_SERVER_ERROR } from '../_common/http/errors/500';
import {
  UsersCreateInputDto,
  UsersCreateOutputDto,
} from './dtos/users.create.dto';
import { PasswordCheckingInterceptor } from './infrastructure/interceptor/password.checking.interceptor';
import { User } from './infrastructure/decorator/user.decorator';
import { UsersBaseDto } from './dtos/users.base.dto';
import {
  UsersDeleteInputDto,
  UsersDeleteOutputDto,
} from './dtos/users.delete.dto';
import { AccessTokenGuard } from './infrastructure/token/guards/jwt.access.guard';
import { TWO_HUNDRED_OK } from '../_common/http/success/200';
import { TWO_HUNDRED_FOUR_DELETE_SUCCESS } from '../_common/http/success/204';
import {
  UsersProfileInputDto,
  UsersProfileOutputDto,
} from './dtos/users.profile.dto';
import { UsersListInputDto, UsersListOutputDto } from './dtos/users.list.dto';
import {
  UsersUpdateInputDto,
  UsersUpdateOutputDto,
} from './dtos/users.update.dto';
import {
  UsersLoginInputDto,
  UsersLoginOutputDto,
} from './dtos/users.login.dto';
import {
  UsersLogoutInputDto,
  UsersLogoutOutputDto,
} from './dtos/users.logout.dto';
import { RefreshTokenGuard } from './infrastructure/token/guards/jwt.refresh.guard';
import { UsersModule } from './users.module';
import { UsersModel } from './entites/users.model';

@Controller('users')
export class UsersController {
  constructor(@Inject('SERVICE') private readonly service: UsersInterface) {}

  @Get('/list')
  @ApiConsumes('application/x-www-form/urlencoded')
  @ApiOperation({
    summary: 'USERS LIST API',
    description: '유저 리스트 출력 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({ status: 400, description: `` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async list(
    @Query() dto: UsersListInputDto,
  ): Promise<UsersListOutputDto> {
    return await this.service.list(dto);
  }

  @Post('/')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'USER CREATE API', description: '회원 가입 절차' })
  @ApiResponse({ status: 201, description: `${CREATE_SUCCESS}` })
  @ApiResponse({ status: 400, description: `` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersCreateInputDto })
  @UseInterceptors(PasswordCheckingInterceptor)
  private async create(
    @Body() dto: UsersCreateInputDto,
  ): Promise<UsersCreateOutputDto> {
    return await this.service.create(dto);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access_token')
  @Patch('/delete')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'USER DELETED AT API',
    description: `유저 삭제 날짜 지정 절차`,
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 204,
    description: `${TWO_HUNDRED_FOUR_DELETE_SUCCESS}`,
  })
  @ApiResponse({ status: 400, description: `` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async delete(
    @User() user: Pick<UsersBaseDto, 'id'>,
  ): Promise<UsersDeleteOutputDto> {
    const { id } = user;
    return await this.service.delete({ id });
  }

  @Get('/')
  @ApiBearerAuth('access_token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'USERS PROFILE INQUIRY API',
    description: '유저 프로필 조회절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({ status: 400, description: `` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async profile(
    @User() user: Pick<UsersBaseDto, 'id'>,
  ): Promise<UsersProfileOutputDto> {
    console.log('user : ', user);
    return await this.service.profile({ id: user.id });
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access_token')
  @UseInterceptors(PasswordCheckingInterceptor)
  @Patch('/update')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'USER PROFILE MODIFY API',
    description: '유저 프로필 정보 수정',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({ status: 400, description: `` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersUpdateInputDto })
  private async update(
    @Body()
    dto: Pick<UsersUpdateInputDto, 'appId' | 'nickname' | 'password' | 'phone'>,
    @User() user: UsersBaseDto,
  ): Promise<UsersUpdateOutputDto> {
    console.log('dto : ', dto);
    console.log('iuser : ', user);
    return await this.service.update({
      ...dto,
      id: user.id,
    });
  }

  @Post('/login')
  @UseInterceptors(PasswordCheckingInterceptor)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'USER LOGIN API', description: '로그인 절차' })
  @ApiResponse({ status: 201, description: `${LOGIN_SUCCESS}` })
  @ApiResponse({ status: 400, description: `` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersLoginInputDto })
  private async login(
    @Body() dto: UsersLoginInputDto,
  ): Promise<UsersLoginOutputDto> {
    return await this.service.login(dto);
  }

  @Patch('/logout')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('refresh_token')
  @ApiOperation({ summary: 'USER LOGOUT API', description: '로그아웃 절차' })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({ status: 400, description: `` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersLogoutInputDto })
  private async logout(
    @User() user: Pick<UsersBaseDto, 'id'>,
  ): Promise<UsersLogoutOutputDto> {
    const { id } = user;
    return await this.service.logout({ id });
  }
}
