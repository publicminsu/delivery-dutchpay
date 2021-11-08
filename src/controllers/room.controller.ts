import { RoomEntity } from "@/entity/room.entity";
import { Room } from "@/interfaces/room.interface";
import RoomService from "@/services/rooms.service";
import { Controller, Get, Param, Post } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

@Controller()
export class RoomController{
    public roomService=new RoomService();
    @Get('/rooms')
    async getRooms(){
        const findAllRoomsData: RoomEntity[] = await this.roomService.findAllRoom();
        return { data: findAllRoomsData, message: 'findAll' };
    }
    @Get('/rooms/:rid')
    @OpenAPI({ summary: 'Return find a room' })
    async joinRoom(@Param('rid') roomId: number) {
      const findOneRoomData: RoomEntity = await this.roomService.findRoomById(roomId);
      return { data: findOneRoomData, message: 'findOne' };
    }
    //메뉴,사진은 socketio
}