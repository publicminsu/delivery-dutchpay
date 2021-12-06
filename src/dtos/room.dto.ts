import { Category } from '@/entity/room.entity';
import { Menu } from '@/interfaces/room.interface';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import multer from 'multer';

export class MenuInfo {
  name: string;
  price: number;
}
export class TipInfo {
  largerThan: number;
  price: number;
}
export class CreateRoomDto {
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

export class AddMenuDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => Menu)
  public menus: Menu[];
}
export class AgreementDto {
  @IsBoolean()
  public bool: boolean;
}
export const fileUploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, 'uploads/');
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, req.params.rid + '-' + Date.now() + '-' + file.originalname);
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];
    if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png') {
      cb(null, true);
    } else {
      return cb({ message: '*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다.' }, false);
    }
  },
};
