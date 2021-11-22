import { Category } from '@/entity/room.entity';
import { Menu } from '@/interfaces/room.interface';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';

export class MenuInfo {
  name: string;
  price: number;
}
//isObject사용하기위해 interface에서 빼왔습니다.
//카테고리
//사진넣기
export class TipInfo {
  largerThan: number;
  price: number;
}
export class CreateRoomDto {
  @IsString()
  public userEmail: string;

  @IsString()
  public shopName: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => TipInfo)
  public tipInfos: TipInfo[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => Menu)
  public perchaserMenus: Menu[];
  @IsEnum(Category)
  public roomType: string;
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
  @Type(() => Menu)
  public menus: Menu[];
}
