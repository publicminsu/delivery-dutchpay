import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LogoutUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';
import { getRepository } from 'typeorm';
import { User } from '@/entity/user.entity';
import UserService from './users.service';

class AuthService {
  public userRepository = getRepository(User);

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.userRepository.findOne(userData.email);
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword; //암호화를 사용하는거 같아서 교체했습니다.
    const createUserData: User = new User(userData);
    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");
    const userService = new UserService();
    const findUser: User = await userService.findUserByEmail(userData.email);
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);
    const hashedPassword = await bcrypt.hash(userData.password, 10); //암호화한 비밀번호를 비교해야하는거 같아서
    //추가했습니다. 틀린지는 모르겠습니다.
    const isPasswordMatching: boolean = await bcrypt.compare(hashedPassword, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userEmail: string): Promise<User> {
    if (isEmpty(userEmail)) throw new HttpException(400, "You're not userData");

    //const findUser: User = this.users.find(user => user.email === userData.email && user.password === userData.password);
    const userService = new UserService();
    const findUser: User = await userService.findUserByEmail(userEmail);
    if (findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
