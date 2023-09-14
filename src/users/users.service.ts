import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersDtoInterface } from './interfaces/users.dto.interface';
import {
  UsersCreateInputDto,
  UsersCreateOutputDto,
} from './dtos/users.create.dto';
import {
  UsersDeleteInputDto,
  UsersDeleteOutputDto,
} from './dtos/users.delete.dto';

import { UsersListInputDto, UsersListOutputDto } from './dtos/users.list.dto';
import {
  UsersReIssuancePasswordInputDto,
  UsersReIssuancePasswordOutputDto,
  UsersUpdateEmailInputDto,
  UsersUpdateEmailOutputDto,
  UsersUpdateNicknameInputDto,
  UsersUpdateNicknameOutputDto,
  UsersUpdatePhoneInputDto,
  UsersUpdatePhoneOutputDto,
} from './dtos/users.update.dto';
import {
  APP_ID_REQUIRED,
  EMAIL_REQUIRED,
  NICKNAME_REQUIRED,
  PAGE_REQUIRED,
  PASSWORD_REQUIRED,
  PHONE_REQUIRED,
  TAKE_REQUIRED,
  UNIQUE_ID_REQUIRED,
} from '../_common/https/errors/400';
import { UsersModel } from './entites/users.model';
import { UsersRefreshTokenReIssuanceInterface } from './interfaces/users.refresh.token.re.issuance.interface';
import {
  UsersLoginInputDto,
  UsersLoginOutputDto,
} from './dtos/users.login.dto';
import {
  UsersLogoutInputDto,
  UsersLogoutOutputDto,
} from './dtos/users.logout.dto';
import {
  UsersProfileInputDto,
  UsersProfileOutputDto,
} from './dtos/users.profile.dto';
import {
  UsersRefreshTokenReIssuanceInputDto,
  UsersRefreshTokenReIssuanceOutputDto,
} from './dtos/user.refresh.token.re.issuance.dto';
import { UsersFindByEntityInterface } from './interfaces/users.find.by.entity.interface';
import { UsersEntityInterface } from './interfaces/users.entity.interface';
import { UsersRefreshTokenReIssuanceDtoInterface } from './interfaces/users.refresh.token.re.issuance.dto.interface';
import {
  ALREADY_EMAIL,
  ALREADY_NICKNAME,
  ALREADY_PHONE,
} from '../_common/https/errors/409';
import { UsersDuplicateVerificationEntityInterface } from './interfaces/users.duplicate.verification.entity.interface';
import { UsersDuplicateVerificationDtoInterface } from './interfaces/users.duplicate.verification.dto.interface';
import {
  UsersAppIdDuplicateVerificationInputDto,
  UsersAppIdDuplicateVerificationOutputDto,
  UsersEmailDuplicateVerificationInputDto,
  UsersEmailDuplicateVerificationOutputDto,
  UsersNicknameDuplicateVerificationInputDto,
  UsersNicknameDuplicateVerificationOutputDto,
  UsersPhoneDuplicateVerificationInputDto,
  UsersPhoneDuplicateVerificationOutputDto,
} from './dtos/users.duplicate.verification.dto';
import { NOTFOUND_USER } from '../_common/https/errors/404';

interface UsersMergeInterface
  extends UsersDtoInterface,
    UsersRefreshTokenReIssuanceDtoInterface,
    UsersDuplicateVerificationDtoInterface {}

@Injectable()
export class UsersService implements UsersMergeInterface {
  constructor(
    @Inject('REPOSITORY')
    private readonly repository: UsersEntityInterface,
    @Inject('FIND_BY_REPOSITORY')
    private readonly findByRepository: UsersFindByEntityInterface,
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private readonly refreshTokenRepository: UsersRefreshTokenReIssuanceInterface,
    @Inject('DUPLICATE_VERIFICATION_REPOSITORY')
    private readonly duplicateVerificationRepository: UsersDuplicateVerificationEntityInterface,
  ) {}

  public async create(dto: UsersCreateInputDto): Promise<UsersCreateOutputDto> {
    const { appId, phone, nickname, password, email } = dto;

    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);
    if (!password) throw new BadRequestException(PASSWORD_REQUIRED);
    if (!phone) throw new BadRequestException(PHONE_REQUIRED);
    if (!nickname) throw new BadRequestException(NICKNAME_REQUIRED);
    if (!email) throw new BadRequestException(EMAIL_REQUIRED);

    const user = new UsersModel();
    user._create = dto;

    return await this.repository.create(user._create);
  }

  public async delete(dto: UsersDeleteInputDto): Promise<UsersDeleteOutputDto> {
    const { id } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const user = new UsersModel();
    user._delete = dto;
    return await this.repository.delete(user._delete);
  }

  public async list(dto: UsersListInputDto): Promise<UsersListOutputDto> {
    const { take, page } = dto;
    if (take < 1) throw new BadRequestException(TAKE_REQUIRED);
    if (page < 1) throw new BadRequestException(PAGE_REQUIRED);

    return await this.repository.list(dto);
  }

  public async updateNickname(
    dto: UsersUpdateNicknameInputDto,
  ): Promise<UsersUpdateNicknameOutputDto> {
    const { id, nickname } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!nickname) throw new BadRequestException(NICKNAME_REQUIRED);

    const userFindByIdOrNickname =
      await this.findByRepository.usersFindByIdOrNickname(dto);
    if (!userFindByIdOrNickname) throw new NotFoundException(NOTFOUND_USER);

    if (
      !!userFindByIdOrNickname &&
      userFindByIdOrNickname.id !== id &&
      userFindByIdOrNickname.nickname === nickname
    )
      throw new ConflictException(ALREADY_NICKNAME);

    const user = new UsersModel();
    user._updateNickname = dto;

    return await this.repository.updateNickname(user._updateNickname);
  }

  public async updatePhone(
    dto: UsersUpdatePhoneInputDto,
  ): Promise<UsersUpdatePhoneOutputDto> {
    const { id, phone } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!phone) throw new BadRequestException(PHONE_REQUIRED);

    const userFindByIdOrPhone = await this.findByRepository.userFindById({
      id,
    });
    if (!userFindByIdOrPhone) throw new NotFoundException(NOTFOUND_USER);

    if (
      !!userFindByIdOrPhone &&
      userFindByIdOrPhone.id !== id &&
      userFindByIdOrPhone.phone === phone
    )
      throw new ConflictException(ALREADY_PHONE);

    const user = new UsersModel();
    user._updatePhone = dto;

    return await this.repository.updatePhone(user._updatePhone);
  }

  public async updateEmail(
    dto: UsersUpdateEmailInputDto,
  ): Promise<UsersUpdateEmailOutputDto> {
    const { id, email } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!email) throw new BadRequestException(EMAIL_REQUIRED);

    const userFindByIdOrEmail = await this.findByRepository.userFindById({
      id,
    });
    if (!userFindByIdOrEmail) throw new NotFoundException(NOTFOUND_USER);

    if (
      !!userFindByIdOrEmail &&
      userFindByIdOrEmail.id !== id &&
      userFindByIdOrEmail.email === email
    )
      throw new ConflictException(ALREADY_EMAIL);

    const user = new UsersModel();
    user._updateEmail = dto;

    return await this.repository.updateEmail(user._updateEmail);
  }

  public async reIssuancePassword(
    dto: UsersReIssuancePasswordInputDto,
  ): Promise<UsersReIssuancePasswordOutputDto> {
    const { id, password } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!password) throw new BadRequestException(PASSWORD_REQUIRED);

    const user = new UsersModel();
    user._reIssuancePassword = dto;

    return await this.repository.reIssuancePassword(user._reIssuancePassword);
  }

  public async login(dto: UsersLoginInputDto): Promise<UsersLoginOutputDto> {
    const { appId, password } = dto;
    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);
    if (!password) throw new BadRequestException(PASSWORD_REQUIRED);

    const user = new UsersModel();
    user._login = dto;
    return await this.repository.login(user._login);
  }

  public async logout(dto: UsersLogoutInputDto): Promise<UsersLogoutOutputDto> {
    const { id } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const user = new UsersModel();
    user._logout = dto;
    return await this.repository.logout(user._logout);
  }

  public async profile(
    dto: UsersProfileInputDto,
  ): Promise<UsersProfileOutputDto> {
    const { id } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);

    const user = new UsersModel();
    user._profile = dto;
    return await this.repository.profile(user._profile);
  }

  public async refresh(
    dto: UsersRefreshTokenReIssuanceInputDto,
  ): Promise<UsersRefreshTokenReIssuanceOutputDto> {
    const { id, appId, phone } = dto;
    if (!id) throw new BadRequestException(UNIQUE_ID_REQUIRED);
    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);
    if (!phone) throw new BadRequestException(PHONE_REQUIRED);

    const user = new UsersModel();
    user._refreshTokenReIssuance = dto;

    return await this.refreshTokenRepository.refresh(
      user._refreshTokenReIssuance,
    );
  }

  public async appIdDuplicateVerification(
    dto: UsersAppIdDuplicateVerificationInputDto,
  ): Promise<UsersAppIdDuplicateVerificationOutputDto> {
    const { appId } = dto;
    if (!appId) throw new BadRequestException(APP_ID_REQUIRED);

    const user = new UsersModel();
    user._appId = dto;

    const { appIdExists } =
      await this.duplicateVerificationRepository.appIdDuplicateVerification(
        user._appId,
      );

    return { appIdExists };
  }

  public async emailDuplicateVerification(
    dto: UsersEmailDuplicateVerificationInputDto,
  ): Promise<UsersEmailDuplicateVerificationOutputDto> {
    const { email } = dto;
    if (!email) throw new BadRequestException(EMAIL_REQUIRED);

    const user = new UsersModel();
    user._email = dto;

    const { emailExists } =
      await this.duplicateVerificationRepository.emailDuplicateVerification(
        user._email,
      );

    return { emailExists };
  }

  public async nicknameDuplicateVerification(
    dto: UsersNicknameDuplicateVerificationInputDto,
  ): Promise<UsersNicknameDuplicateVerificationOutputDto> {
    const { nickname } = dto;
    if (!nickname) throw new BadRequestException(NICKNAME_REQUIRED);

    const user = new UsersModel();
    user._nickname = dto;

    const { nicknameExists } =
      await this.duplicateVerificationRepository.nicknameDuplicateVerification(
        user._nickname,
      );

    return { nicknameExists };
  }

  public async phoneDuplicateVerification(
    dto: UsersPhoneDuplicateVerificationInputDto,
  ): Promise<UsersPhoneDuplicateVerificationOutputDto> {
    const { phone } = dto;
    if (!phone) throw new BadRequestException(PHONE_REQUIRED);

    const user = new UsersModel();
    user._phone = dto;

    const { phoneExists } =
      await this.duplicateVerificationRepository.phoneDuplicateVerification(
        user._phone,
      );

    return { phoneExists };
  }
}
