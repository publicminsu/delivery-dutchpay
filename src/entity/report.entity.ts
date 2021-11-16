import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity()
export class Report {
  constructor() {}
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, room => room.id)
  room: Room;

  @ManyToOne(() => User, user => user.id)
  accuser: User;

  @ManyToOne(() => User, user => user.id)
  defendant: User;

  @Column()
  reportType: number;
}
