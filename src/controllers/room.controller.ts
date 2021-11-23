import { CreateRoomDto } from '@/dtos/room.dto';
import { Category, Room } from '@/entity/room.entity';
import RoomService from '@/services/rooms.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
export class RoomController {
  public roomService = new RoomService();
  @Get('/rooms')
  async getRooms() {
    const findAllRoomsData: Room[] = await this.roomService.findAllRoom();
    return { data: findAllRoomsData, message: 'findAll' };
  }
  @Get('/rooms/:Category')
  async getRoomsByCategory(@Param('Category') category: Category) {
    const findAllRoomsData: Room[] = await this.roomService.findRoomByCategory(category);
    return { data: findAllRoomsData, message: 'findAll' };
  } //카테고리 dto로 받아서 not이면 활성화된거 전부, food나 디저트면 해당하는거만 찾게끔했습니다.
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
  @Delete('/rooms/:rid')
  @OpenAPI({ summary: 'Deactivated room' })
  async endRoom(@Param('rid') roomId: number) {
    const endRoomData: Room = await this.roomService.endRoom(roomId);
    return { data: endRoomData, message: 'deactivated' };
  }
}
