import { Contains, contains, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  public studentId: number;

  @IsString()
  public phone: string;

  @IsString()
  public nickname: string;

  @IsString()
  public password: string;

  @Contains('@hknu.ac.kr')
  @IsEmail({allow_utf8_local_part:false})//utf8 영어가 아닌 경우 허용안함
  public email: string;
}
