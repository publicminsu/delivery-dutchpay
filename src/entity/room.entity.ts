import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participant } from './participant.entity';
import { Tip } from './tip.entity';
import { User } from './user.entity';
export enum Category {
  Food = 'food',
  Dessert = 'dessert',
  _Not = '_not',
}
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

  @Column({
    type: 'enum',
    enum: Category,
    default: Category._Not,
  })
  roomType: string; //카테고리

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  imagePath: string;
}
