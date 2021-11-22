import { Response } from 'express';
import { Controller, Body, Post, UseBefore, HttpCode, Res } from 'routing-controllers';
import { CreateUserDto, LoginUserDto, LogoutUserDto } from '@dtos/users.dto';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';
import AuthService from '@services/auth.service';
import { User } from '@/entity/user.entity';

@Controller()
export class AuthController {
  public authService = new AuthService();

  @Post('/signup')
  @UseBefore(validationMiddleware(CreateUserDto, 'body'))
  @HttpCode(201)
  async signUp(@Body() userData: CreateUserDto) {
    const signUpUserData: User = await this.authService.signup(userData);
    return { data: signUpUserData, message: 'signup' };
  }

  @Post('/login')
  @UseBefore(validationMiddleware(LoginUserDto, 'body'))
  async logIn(@Body() userData: LoginUserDto, @Res() res: Response) {
    const { cookie, findUser } = await this.authService.login(userData);
    res.setHeader('Set-Cookie', [cookie]);
    return { data: findUser, message: 'login' };
  } //dto

  @Post('/logout')
  @UseBefore(authMiddleware)
  async logOut(@Body() userData: LogoutUserDto, @Res() res: Response) {
    const logOutUserData: User = await this.authService.logout(userData);
    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
    res.send();
    return { data: logOutUserData, message: 'logout' };
  }
}
