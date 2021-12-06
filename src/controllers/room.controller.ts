import { AddMenuDto, AgreementDto, CreateRoomDto, fileUploadOptions } from '@/dtos/room.dto';
import { RequestWithUser } from '@/dtos/users.dto';
import { Participant } from '@/entity/participant.entity';
import { Category, Room } from '@/entity/room.entity';
import authMiddleware from '@/middlewares/auth.middleware';
import RoomService from '@/services/rooms.service';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseBefore } from 'routing-controllers';
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
    return { data: findAllRoomsData, message: 'findAllCategory' };
  } //카테고리 dto로 받아서 not이면 활성화된거 전부, food나 디저트면 해당하는거만 찾게끔했습니다.
  @Get('/rooms/:rid/join')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Join room' })
  async joinRoom(@Req() req: RequestWithUser, @Param('rid') roomId: number) {
    const findOneRoomData: Room = await this.roomService.joinRoom(req.user, roomId);
    return { data: findOneRoomData, message: 'JoinRoom' };
  }
  @Put('/rooms/:rid/:uid')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'change Master' })
  async changeMasterRoom(@Req() req: RequestWithUser, @Param('rid') roomId: number, @Param('uid') userId: number) {
    const changeMasterRoomData: Room = await this.roomService.changeMaster(req.user, roomId, userId);
    return { data: changeMasterRoomData, message: 'findOne' };
  }
  @Put('/rooms/:rid') //방 나감
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Leave the room' })
  async leaveRoom(@Req() req: RequestWithUser, @Param('rid') roomId: number) {
    const changeMasterRoomData: Room = await this.roomService.leaveRoom(req.user, roomId);
    return { data: changeMasterRoomData, message: 'findOne' };
  }
  @Post('/rooms')
  // @UseBefore(validationMiddleware(CreateRoomDto, 'body'))
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Create a new room' })
  async createRoom(@Req() req: RequestWithUser, @Body() roomData: CreateRoomDto) {
    const createRoomData: Room = await this.roomService.createRoom(req.user, roomData);
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
  @Post('/rooms/:rid/menu')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'add Menu' })
  async addMenu(@Req() req: RequestWithUser, @Param('rid') roomId: number, @Body() roomData: AddMenuDto) {
    const addMenuParticipantData: Participant = await this.roomService.addMenu(req.user, roomId, roomData);
    return { data: addMenuParticipantData, message: 'add Menu' };
  }
  @Delete('/rooms/:rid/menu/:mid')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'delete Menu' })
  async deleteMenu(@Req() req: RequestWithUser, @Param('rid') roomId: number, @Param('mid') menuId: number) {
    const deleteMenuParticipantData: Participant = await this.roomService.deleteMenu(req.user, roomId, menuId);
    return { data: deleteMenuParticipantData, message: 'add Menu' };
  }
  @Post('/rooms/:rid/agreement')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'agreement selected' })
  async selectedAgreement(@Req() req: RequestWithUser, @Param('rid') roomId: number, @Body() roomData: AgreementDto) {
    const selectedParticipantData: Participant = await this.roomService.selectedAgreement(req.user, roomId, roomData);
    return { data: selectedParticipantData, message: 'selected Agreement' };
  }
  @Get('/rooms/:rid/agreement') //put은 오류가 뜹니다.
  @OpenAPI({ summary: 'agreement init' })
  async initAgreement(@Param('rid') roomId: number) {
    console.log(roomId);
    const initAgreementRoomData: Room = await this.roomService.initAgreement(roomId);
    return { data: initAgreementRoomData, message: 'init Agreement' };
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
