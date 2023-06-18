import { BcryptDecodedInterfaceInputDto } from '../inbounds/dtos/bcrypt.decoded.interface.input.dto';
import { BcryptDecodedInterfaceOutputDto } from '../outbounds/dtos/bcrypt.decoded.interface.output.dto';

export interface BcryptDecodedInterface {
  readonly decoded: (
    dto: BcryptDecodedInterfaceInputDto,
  ) => Promise<BcryptDecodedInterfaceOutputDto>;
}
