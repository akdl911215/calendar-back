import { BaseOutputDto } from '../../../../../_common/dtos/base.output.dto';

export class BcryptEncodedInterfaceOutputDto extends BaseOutputDto<{
  readonly encoded: string;
}> {}
