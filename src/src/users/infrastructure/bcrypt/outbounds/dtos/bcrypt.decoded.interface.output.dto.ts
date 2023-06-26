import { BaseOutputDto } from '../../../../../_common/dtos/base.output.dto';

export class BcryptDecodedInterfaceOutputDto extends BaseOutputDto<{
  readonly decoded: boolean;
}> {}
