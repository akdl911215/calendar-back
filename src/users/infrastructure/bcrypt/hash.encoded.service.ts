import { Injectable } from '@nestjs/common';
import { BcryptEncodedInterface } from './interfaces/bcrypt.encoded.interface';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { BcryptEncodedInterfaceInputDto } from './inbounds/dtos/bcrypt.encoded.interface.input.dto';
import { BcryptEncodedInterfaceOutputDto } from './outbounds/dtos/bcrypt.encoded.interface.output.dto';

@Injectable()
export class HashEncodedService implements BcryptEncodedInterface {
  constructor(private readonly configService: ConfigService) {}
  public async encoded(
    dto: BcryptEncodedInterfaceInputDto,
  ): Promise<BcryptEncodedInterfaceOutputDto> {
    const { password } = dto;

    const encodedPassword: string = await bcrypt.hash(
      password,
      Number(this.configService.get<number>('BCRIPT_SOLT_NUMBER')),
    );

    return {
      encoded: encodedPassword,
    };
  }
}
