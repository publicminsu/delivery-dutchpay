import { Request, Response } from 'express';
import { Controller, Body, Post, UseBefore, HttpCode, Res, Req } from 'routing-controllers';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
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
    return { data: cookie, message: 'login' };
  } //dto

  @Post('/logout')
  //@UseBefore(authMiddleware)
  async logOut(@Res() res: Response) {
    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
    return { message: 'logout' };
  }
}
