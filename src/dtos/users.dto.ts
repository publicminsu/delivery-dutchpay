import { Contains, IsEmail, IsNumber, IsString } from 'class-validator';

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
  @IsEmail({ allow_utf8_local_part: false }) //utf8 영어가 아닌 경우 허용안함 제대로 적용이 되는지는 모르겠습니다.
  //저번에 테스트했을때는 안됐습니다.
  public email: string;
}
export class LogoutUserDto {
  public email: string;
  public password: string;
}
export class reportUserDto {
  public accuserId: number;
  public reportType: number;
}
