import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseOutputDto } from '../../../../_common/dtos/base.output.dto';

export class GenerateTokenInputDto {
  @IsString()
  @ApiProperty({
    description: 'access-token',
    type: String,
    required: false,
    default: null,
  })
  accessToken: string;
  @IsString()
  @ApiProperty({
    description: 'refresh-token',
    type: String,
    required: false,
    default: null,
  })
  refreshToken: string;
}

export class GenerateTokenOutputDto extends BaseOutputDto<GenerateTokenInputDto> {}
