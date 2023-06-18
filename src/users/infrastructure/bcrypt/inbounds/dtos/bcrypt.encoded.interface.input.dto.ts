import { IsNotEmpty, IsString } from 'class-validator';

export class BcryptEncodedInterfaceInputDto {
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
