import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Room } from './room.entity';
import { User } from './user.entity';
export enum agreement {
  True = 'true',
  False = 'false',
  _Not = '_not',
}
@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, room => room.id)
  @JoinColumn()
  room: Room;

  @ManyToOne(() => User, user => user.id, { eager: true })
  user: User;

  @OneToMany(() => Menu, menu => menu.participant, { eager: true, cascade: true })
  menus: Menu[];
  @Column({
    type: 'enum',
    enum: agreement,
    default: agreement._Not,
  })
  agreement: string; //카테고리
}
