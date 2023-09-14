import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersDtoInterface } from './interfaces/users.dto.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CREATE_SUCCESS, LOGIN_SUCCESS } from '../_common/https/success/201';
import { INTERNAL_SERVER_ERROR } from '../_common/https/errors/500';
import {
  UsersCreateInputDto,
  UsersCreateOutputDto,
} from './dtos/users.create.dto';
import { PasswordCheckingInterceptor } from './infrastructure/interceptor/password.checking.interceptor';
import { User } from './infrastructure/decorator/user.decorator';
import { UsersBaseDto } from './dtos/users.base.dto';
import { UsersDeleteOutputDto } from './dtos/users.delete.dto';
import { AccessTokenGuard } from './infrastructure/token/guards/jwt.access.guard';
import { TWO_HUNDRED_OK } from '../_common/https/success/200';
import { TWO_HUNDRED_FOUR_DELETE_SUCCESS } from '../_common/https/success/204';
import {
  UsersProfileInputDto,
  UsersProfileOutputDto,
} from './dtos/users.profile.dto';
import { UsersListInputDto, UsersListOutputDto } from './dtos/users.list.dto';
import {
  UsersLoginInputDto,
  UsersLoginOutputDto,
} from './dtos/users.login.dto';
import { UsersLogoutOutputDto } from './dtos/users.logout.dto';
import { RefreshTokenGuard } from './infrastructure/token/guards/jwt.refresh.guard';
import {
  APP_ID_REQUIRED,
  EMAIL_REQUIRED,
  NICKNAME_REQUIRED,
  NO_MATCH_APP_ID,
  NO_MATCH_PASSWORD,
  PAGE_REQUIRED,
  PASSWORD_REQUIRED,
  PHONE_REQUIRED,
  TAKE_REQUIRED,
  TOKEN_NOT_EXIST,
  UNIQUE_ID_REQUIRED,
} from '../_common/https/errors/400';
import {
  ALREADY_APP_ID,
  ALREADY_EMAIL,
  ALREADY_NICKNAME,
  ALREADY_PHONE,
} from '../_common/https/errors/409';
import { NOTFOUND_USER } from '../_common/https/errors/404';
import { UNAUTHORIZED } from '../_common/https/errors/401';
import { UsersRefreshTokenReIssuanceOutputDto } from './dtos/user.refresh.token.re.issuance.dto';
import { UsersRefreshTokenReIssuanceDtoInterface } from './interfaces/users.refresh.token.re.issuance.dto.interface';
import {
  UsersReIssuancePasswordInputDataDto,
  UsersReIssuancePasswordOutputDto,
  UsersUpdateEmailInputDataDto,
  UsersUpdateEmailInputDto,
  UsersUpdateEmailOutputDto,
  UsersUpdateNicknameInputDateDto,
  UsersUpdateNicknameInputDto,
  UsersUpdateNicknameOutputDto,
  UsersUpdatePhoneInputDataDto,
  UsersUpdatePhoneInputDto,
  UsersUpdatePhoneOutputDto,
} from './dtos/users.update.dto';
import { UsersDuplicateVerificationDtoInterface } from './interfaces/users.duplicate.verification.dto.interface';
import {
  UsersAppIdDuplicateVerificationOutputDto,
  UsersEmailDuplicateVerificationOutputDto,
  UsersNicknameDuplicateVerificationOutputDto,
  UsersPhoneDuplicateVerificationOutputDto,
} from './dtos/users.duplicate.verification.dto';
import { UsersDto } from '../_common/dtos/users.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('SERVICE') private readonly service: UsersDtoInterface,
    @Inject('REFRESH_TOKEN_SERVICE')
    private readonly refreshTokenService: UsersRefreshTokenReIssuanceDtoInterface,
    @Inject('DUPLICATE_VERIFICATION_SERVICE')
    private readonly duplicateVerificationService: UsersDuplicateVerificationDtoInterface,
  ) {}
  @Get('/list')
  @ApiConsumes('application/x-www-form/urlencoded')
  @ApiOperation({
    summary: 'USERS LIST API',
    description: '유저 리스트 출력 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${TAKE_REQUIRED}, ${PAGE_REQUIRED}`,
  })
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
  @ApiResponse({
    status: 400,
    description: `${APP_ID_REQUIRED}, ${PASSWORD_REQUIRED}, ${PHONE_REQUIRED}, ${NICKNAME_REQUIRED}`,
  })
  @ApiResponse({
    status: 409,
    description: `${ALREADY_APP_ID}, ${ALREADY_PHONE}, ${ALREADY_NICKNAME}`,
  })
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
  @ApiResponse({
    status: 400,
    description: `${UNIQUE_ID_REQUIRED}, ${TOKEN_NOT_EXIST}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 404, description: `${NOTFOUND_USER}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async delete(
    @User() user: UsersBaseDto,
  ): Promise<UsersDeleteOutputDto> {
    const { id } = user;
    return await this.service.delete({ id });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/')
  @ApiBearerAuth('access_token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'USERS PROFILE INQUIRY API',
    description: '유저 프로필 조회절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${UNIQUE_ID_REQUIRED}, ${TOKEN_NOT_EXIST}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 404, description: `${NOTFOUND_USER}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersProfileInputDto })
  private async profile(
    @User() user: UsersProfileInputDto,
  ): Promise<UsersProfileOutputDto> {
    return await this.service.profile({ id: user.id });
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access_token')
  @UseInterceptors(PasswordCheckingInterceptor)
  @Patch('/update/nickname')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'USER NICKNAME MODIFY API',
    description: '유저 닉네임 정보 수정',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${UNIQUE_ID_REQUIRED},  ${TOKEN_NOT_EXIST}, ${NICKNAME_REQUIRED}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 404, description: `${NOTFOUND_USER}` })
  @ApiResponse({ status: 409, description: `${ALREADY_NICKNAME}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersUpdateNicknameInputDto })
  private async updateNickname(
    @Body()
    dto: UsersUpdateNicknameInputDateDto,
    @User() user: UsersDto,
  ): Promise<UsersUpdateNicknameOutputDto> {
    return await this.service.updateNickname({
      id: user.id,
      nickname: dto.nickname,
    });
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access_token')
  @UseInterceptors(PasswordCheckingInterceptor)
  @Patch('/update/phone')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'USER PHONE MODIFY API',
    description: '유저 핸드폰 정보 수정',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${UNIQUE_ID_REQUIRED}, ${PHONE_REQUIRED}, ${TOKEN_NOT_EXIST}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 404, description: `${NOTFOUND_USER}` })
  @ApiResponse({ status: 409, description: `${ALREADY_PHONE}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersUpdatePhoneInputDto })
  private async updatePhone(
    @Body() dto: UsersUpdatePhoneInputDataDto,
    @User() user: UsersBaseDto,
  ): Promise<UsersUpdatePhoneOutputDto> {
    return await this.service.updatePhone({
      id: user.id,
      phone: dto.phone,
    });
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access_token')
  @UseInterceptors(PasswordCheckingInterceptor)
  @Patch('/reIssuance/password')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'USER PASSWORD RE ISSUANCE API',
    description: '유저 비밀번호 재발급 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${UNIQUE_ID_REQUIRED}, ${PHONE_REQUIRED}, ${TOKEN_NOT_EXIST}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 404, description: `${NOTFOUND_USER}` })
  @ApiResponse({ status: 409, description: `${ALREADY_PHONE}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersUpdatePhoneInputDto })
  private async reIssuancePassword(
    @Body() dto: UsersReIssuancePasswordInputDataDto,
    @User() user: UsersBaseDto,
  ): Promise<UsersReIssuancePasswordOutputDto> {
    return await this.service.reIssuancePassword({
      id: user.id,
      password: dto.password,
    });
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access_token')
  @UseInterceptors(PasswordCheckingInterceptor)
  @Patch('/update/email')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: 'USER E-MAIL MODIFY API',
    description: '유저 E-MAIL 정보 수정',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${UNIQUE_ID_REQUIRED}, ${EMAIL_REQUIRED}, ${TOKEN_NOT_EXIST}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 404, description: `${NOTFOUND_USER}` })
  @ApiResponse({ status: 409, description: `${ALREADY_EMAIL}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  @ApiBody({ type: UsersUpdatePhoneInputDto })
  private async updateEmail(
    @Body() dto: UsersUpdateEmailInputDataDto,
    @User() user: UsersBaseDto,
  ): Promise<UsersUpdateEmailOutputDto> {
    return await this.service.updateEmail({
      id: user.id,
      email: dto.email,
    });
  }

  @Post('/login')
  @UseInterceptors(PasswordCheckingInterceptor)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'USER LOGIN API', description: '로그인 절차' })
  @ApiResponse({ status: 201, description: `${LOGIN_SUCCESS}` })
  @ApiResponse({
    status: 400,
    description: `${APP_ID_REQUIRED}, ${PASSWORD_REQUIRED}, ${NO_MATCH_APP_ID}, ${NO_MATCH_PASSWORD}`,
  })
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
  @ApiResponse({
    status: 400,
    description: `${UNIQUE_ID_REQUIRED}, ${TOKEN_NOT_EXIST}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 404, description: `${NOTFOUND_USER}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async logout(
    @User() user: UsersBaseDto,
  ): Promise<UsersLogoutOutputDto> {
    const { id } = user;
    return await this.service.logout({ id });
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('refresh_token')
  @Get('/refresh/token')
  @ApiOperation({
    summary: 'USER REFRESH TOKEN RE ISSUANCE API',
    description: '유저 리프레쉬 토큰 재발급 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({
    status: 400,
    description: `${TOKEN_NOT_EXIST}, ${UNIQUE_ID_REQUIRED}, ${APP_ID_REQUIRED}, ${PHONE_REQUIRED}`,
  })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async refreshTokenReIssuance(
    @User() user: UsersBaseDto,
  ): Promise<UsersRefreshTokenReIssuanceOutputDto> {
    const { id, appId, phone } = user;

    return await this.refreshTokenService.refresh({ id, appId, phone });
  }

  @Get('/duplicate/verification/appId/:appId')
  @ApiOperation({
    summary: 'USER APP ID DUPLICATE VERIFICATION API',
    description: '유저 앱 아이디 중복 확인 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({ status: 400, description: `${APP_ID_REQUIRED}` })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async appIdDuplicateVerification(
    @Param('appId') appId: string,
  ): Promise<UsersAppIdDuplicateVerificationOutputDto> {
    return await this.duplicateVerificationService.appIdDuplicateVerification({
      appId,
    });
  }

  @Get('/duplicate/verification/email/:email')
  @ApiOperation({
    summary: 'USER EMAIL DUPLICATE VERIFICATION API',
    description: '유저 이메일 중복 확인 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({ status: 400, description: `${EMAIL_REQUIRED}` })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async emailDuplicateVerification(
    @Param('email') email: string,
  ): Promise<UsersEmailDuplicateVerificationOutputDto> {
    return await this.duplicateVerificationService.emailDuplicateVerification({
      email,
    });
  }

  @Get('/duplicate/verification/nickname/:nickname')
  @ApiOperation({
    summary: 'USER NICKNAME DUPLICATE VERIFICATION API',
    description: '유저 닉네임 중복 확인 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({ status: 400, description: `${NICKNAME_REQUIRED}` })
  @ApiResponse({ status: 401, description: `${UNAUTHORIZED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async nicknameDuplicateVerification(
    @Param('nickname') nickname: string,
  ): Promise<UsersNicknameDuplicateVerificationOutputDto> {
    return await this.duplicateVerificationService.nicknameDuplicateVerification(
      { nickname },
    );
  }

  @Get('/duplicate/verification/phone/:phone')
  @ApiOperation({
    summary: 'USER PHONE DUPLICATE VERIFICATION API',
    description: '유저 핸드폰 중복 확인 절차',
  })
  @ApiResponse({ status: 200, description: `${TWO_HUNDRED_OK}` })
  @ApiResponse({ status: 400, description: `${PHONE_REQUIRED}` })
  @ApiResponse({ status: 500, description: `${INTERNAL_SERVER_ERROR}` })
  private async phoneDuplicateVerification(
    @Param('phone') phone: string,
  ): Promise<UsersPhoneDuplicateVerificationOutputDto> {
    return await this.duplicateVerificationService.phoneDuplicateVerification({
      phone,
    });
  }
}
