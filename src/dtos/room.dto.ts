import { IsArray, IsEmail, IsNumber, IsObject, IsString } from 'class-validator';

export class MenuInfo {
  name: string;
  price: number;
}
//isObject사용하기위해 interface에서 빼왔습니다.
export class TipInfo {
  largerThan: number;
  price: number;
}
export class CreateRoomDto {
  @IsEmail({ allow_utf8_local_part: false })
  public userEmail: string;
  @IsString()
  public shopName: string;
  @IsArray()
  public tipInfos: TipInfo[];
  @IsArray()
  public perchaserMenus: MenuInfo[];
}

export class JoinRoomDto {
  @IsNumber()
  public roomId: number;
  @IsString()
  public userEmail: string;
}

export class AddMenuDto {
  @IsNumber()
  public roomId: number;
  @IsString()
  public userEmail: string;
  @IsArray()
  public menus: MenuInfo[];
}
