import { CreateRoomDto } from '@/dtos/room.dto';
import { Room } from '@/entity/room.entity';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import RoomService from '@/services/rooms.service';
import { Body, Controller, Get, Param, Post, Put, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
export class RoomController {
  public roomService = new RoomService();
  @Get('/rooms')
  async getRooms() {
    const findAllRoomsData: Room[] = await this.roomService.findAllRoom();
    return { data: findAllRoomsData, message: 'findAll' };
  }
  @Get('/rooms/:rid')
  @OpenAPI({ summary: 'Return find a room' })
  async joinRoom(@Param('rid') roomId: number) {
    const findOneRoomData: Room = await this.roomService.findRoomById(roomId);
    return { data: findOneRoomData, message: 'findOne' };
  } //생각해보니 방에 들어가면 상대방 유저들한테도 socketio 이벤트를 보내야할것 같습니다.
  //메뉴,사진은 socketio
  @Post('/rooms')
  // @UseBefore(validationMiddleware(CreateRoomDto, 'body'))
  @OpenAPI({ summary: 'Create a new room' })
  async createRoom(@Body() roomData: CreateRoomDto) {
    const createRoomData: Room = await this.roomService.createRoom(roomData);
    return { data: createRoomData, message: 'created' };
  }
}
