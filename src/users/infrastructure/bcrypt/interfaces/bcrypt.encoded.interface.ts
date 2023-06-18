import { BcryptEncodedInterfaceInputDto } from '../inbounds/dtos/bcrypt.encoded.interface.input.dto';
import { BcryptEncodedInterfaceOutputDto } from '../outbounds/dtos/bcrypt.encoded.interface.output.dto';

export interface BcryptEncodedInterface {
  readonly encoded: (
    dto: BcryptEncodedInterfaceInputDto,
  ) => Promise<BcryptEncodedInterfaceOutputDto>;
}
