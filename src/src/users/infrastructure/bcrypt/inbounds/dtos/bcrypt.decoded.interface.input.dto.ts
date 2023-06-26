import { IsNotEmpty, IsString } from 'class-validator';

export class BcryptDecodedInterfaceInputDto {
  @IsString()
  @IsNotEmpty()
  public password!: string;

  @IsString()
  @IsNotEmpty()
  public hashPassword!: string;
}
