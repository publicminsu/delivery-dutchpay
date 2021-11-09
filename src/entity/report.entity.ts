import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "./room.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class reportEntity{
    constructor(){}
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(type => RoomEntity, roomEntity => roomEntity.id)
    room: RoomEntity;
  
    @ManyToOne(type => UserEntity, userEntity => userEntity.id)
    accuser: UserEntity;

    @ManyToOne(type => UserEntity, userEntity => userEntity.id)
    defendant: UserEntity;
  
    @Column()
    reportType: number;
}