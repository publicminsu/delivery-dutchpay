import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore, Req } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithReportUser, User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { validationMiddleware } from '@middlewares/validation.middleware';
import RoomService from '@/services/rooms.service';

@Controller()
export class UsersController {
  public userService = new userService();
  public roomService = new RoomService();

  @Get('/users')
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers() {
    const findAllUsersData: User[] = await this.userService.findAllUser();
    return { data: findAllUsersData, message: 'findAll' };
  }

  @Get('/users/:id')
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById(@Param('id') userId: number) {
    const findOneUserData: User = await this.userService.findUserById(userId);
    return { data: findOneUserData, message: 'findOne' };
  }

  @Post('/users')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateUserDto, 'body'))
  @OpenAPI({ summary: 'Create a new user' })
  async createUser(@Body() userData: CreateUserDto) {
    const createUserData: User = await this.userService.createUser(userData);
    return { data: createUserData, message: 'created' };
  }

  @Put('/users/:id')
  @UseBefore(validationMiddleware(CreateUserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser(@Param('id') userId: number, @Body() userData: CreateUserDto) {
    const updateUserData: User[] = await this.userService.updateUser(userId, userData);
    return { data: updateUserData, message: 'updated' };
  }

  @Delete('/users/:id')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser(@Param('id') userId: number) {
    const deleteUserData: User[] = await this.userService.deleteUser(userId);
    return { data: deleteUserData, message: 'deleted' };
  }
  @Post('/rooms/:rid/report/:uid')
  @OpenAPI({ summary: 'report user' })
  async reportUser(@Req() req: RequestWithReportUser, @Param('rid') roomId: number, @Param('uid') userId: number) {
    await this.userService.reportUser(req.user.id, userId, roomId, req.reportType);
    //반환을 뭘해야할지 모르겠어서 안적어뒀습니다. report DTO 작성해서 보내야할까요?
    //req 객체 상속해서 쓰는거 같아서 이렇게 해봤습니다. 가능한지는 모르겠습니다.
    //post방식이라 body로 써도 될거같은데 userdto랑 reportType정보가 같이 body에 담길수있는지 모르겠어서
    //일단 이렇게 해두겠습니다.
  }
}
