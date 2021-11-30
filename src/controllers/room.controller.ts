import { CreateRoomDto, fileUploadOptions } from '@/dtos/room.dto';
import { Category, Room } from '@/entity/room.entity';
import RoomService from '@/services/rooms.service';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile } from 'routing-controllers';
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
  }
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
  @Post('/rooms/:rid/photo')
  @OpenAPI({ summary: 'photo menu upload' })
  async createPurchaseMenu(@UploadedFile('file', { options: fileUploadOptions }) file: Express.Multer.File, @Param('rid') roomId: number) {
    const createPurchaseRoomData: Room = await this.roomService.createPurchaseMenu(file, roomId);
    return { data: createPurchaseRoomData, message: 'createed Purchase' };
  }
  @Get('/rooms/:rid/photo')
  @OpenAPI({ summary: 'photo menu view' })
  async getPurchaseMenu(@Param('rid') roomId: number) {
    const getPurchasePath: string = await this.roomService.getPurchaseMenu(roomId);
    return { data: getPurchasePath, message: 'get Purchase' };
  }
  @Get('/test')
  getAllUsers(@Res() response: Response) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>practice</title>
</head>
<body>
  <form action='/rooms/7/photo' method='post' enctype="multipart/form-data">
    <input type="file" id="file" name="file">
    <input type="submit">
  </form>
</body>
</html>
`;
    return response.send(html);
  }
}
