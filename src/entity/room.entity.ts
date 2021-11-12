import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participant } from './participant.entity';
import { Tip } from './tip.entity';
import { User } from './user.entity';

@Entity()
export class Room {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shop: string;

  @Column()
  date: Date;

  @Column({
    default: 0,
  })
  totalPrice: number;

  @Column({
    default: 0,
  })
  totalTip: number;

  @ManyToOne(() => User, user => user.id, { eager: true })
  purchaser: User;

  @OneToMany(() => Participant, participant => participant.room, { cascade: true, eager: true })
  participants: Participant[];

  @OneToMany(() => Tip, tip => tip.room, { cascade: true, eager: true })
  tipInfos: [Tip];
}
