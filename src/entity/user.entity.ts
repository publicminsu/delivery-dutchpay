import { CreateUserDto } from '@/dtos/users.dto';
import { User } from '@/interfaces/users.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Section {
  Narae = 'narae',
  Hoyoen = 'hoyeon',
  Changjo = 'changjo',
  Bibong = 'bibong',
  _Not = '_not',
}

@Entity()
export class UserEntity implements User {
  constructor(userData?:CreateUserDto) {
    if(userData){
      this.update(userData);
    }
  }
  public update(userData: CreateUserDto) {
    this.studentId = userData.studentId;
    this.phone = userData.phone;
    this.nickname = userData.nickname;
    this.password = userData.password;
    this.email = userData.email;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'int',
    unique: true,
    nullable: false,
  })
  studentId: number;

  @Column({
    type: 'char',
    length: 13,
    unique: true,
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: Section,
    default: Section._Not,
  })
  section: string;

  @Column({
    type: 'bool',
    default: false,
  })
  isVerified: boolean;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column({
    type: 'float',
    default: 36.5,
  })
  mannerRate: number;
}
