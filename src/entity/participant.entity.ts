import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Room } from './room.entity';
import { User } from './user.entity';

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
}
