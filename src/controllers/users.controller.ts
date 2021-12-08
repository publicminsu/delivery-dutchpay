import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore, Req } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserDto, reportUserDto, RequestWithUser } from '@dtos/users.dto';
import userService from '@services/users.service';
import { validationMiddleware } from '@middlewares/validation.middleware';
import RoomService from '@/services/rooms.service';
import { User } from '@/entity/user.entity';
import authMiddleware from '@/middlewares/auth.middleware';

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

  @Get('/users/:uid')
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById(@Param('uid') userId: number) {
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

  @Put('/users/:uid')
  @UseBefore(validationMiddleware(CreateUserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser(@Param('uid') userId: number, @Body() userData: CreateUserDto) {
    const updateUserData: User[] = await this.userService.updateUser(userData);
    return { data: updateUserData, message: 'updated' };
  }

  @Delete('/users/:uid')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser(@Param('uid') userId: number) {
    const deleteUserData: User[] = await this.userService.deleteUser(userId);
    return { data: deleteUserData, message: 'deleted' };
  }
  @Post('/rooms/:rid/report/:uid')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'report user' })
  async reportUser(@Req() req: RequestWithUser, @Body() userData: reportUserDto, @Param('rid') roomId: number, @Param('uid') userId: number) {
    await this.userService.reportUser(req.user.id, userId, roomId, userData.reportType);
    return { message: 'reported' };
    //dto
  }
}
