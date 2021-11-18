import { IsNumber, IsString } from 'class-validator';

export class Menu {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

export class TipInfo {
  @IsNumber()
  largerThan: number;

  @IsNumber()
  price: number;
}
