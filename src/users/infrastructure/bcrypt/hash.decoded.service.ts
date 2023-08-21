import { Injectable } from '@nestjs/common';
import { BcryptDecodedInterface } from './interfaces/bcrypt.decoded.interface';
import * as bcrypt from 'bcrypt';
import { BcryptDecodedInterfaceInputDto } from './inbounds/dtos/bcrypt.decoded.interface.input.dto';
import { BcryptDecodedInterfaceOutputDto } from './outbounds/dtos/bcrypt.decoded.interface.output.dto';

@Injectable()
export class HashDecodedService implements BcryptDecodedInterface {
  public async decoded(
    dto: BcryptDecodedInterfaceInputDto,
  ): Promise<BcryptDecodedInterfaceOutputDto> {
    // password: 입력한 비밀번호
    // hashPassword: DB에 저장된 비밀번호
    const { password, hashPassword } = dto;

    const decodePassword: boolean = await bcrypt.compare(
      password,
      hashPassword,
    );
    return { decoded: decodePassword };
  }
}
