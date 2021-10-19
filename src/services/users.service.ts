import bcrypt, { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { UserEntity } from '@/entity/user.entity';
import { getRepository } from 'typeorm';

class UserService {
  public userRepository = getRepository(UserEntity);

  public async findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await this.userRepository.findOne(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const emailExist: User = await this.userRepository.findOne(userData.email);
    if (emailExist) throw new HttpException(409, `Your email ${userData.email} already exists`);

    const studentIdExist: User = await this.userRepository.findOne(userData.studentId);
    if (studentIdExist) throw new HttpException(409, `Your studentId ${userData.studentId} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = new UserEntity();
    user.update(userData);

    let saved;
    try {
      saved = await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
    }

    return saved;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User[]> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: UserEntity = await this.userRepository.findOne(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    findUser.update(userData);

    await this.userRepository.save(findUser);
    return this.findAllUser();
  }

  public async deleteUser(userId: number): Promise<User[]> {
    const findUser: User = await this.userRepository.findOne(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    await this.userRepository.delete(userId);
    return this.findAllUser();
  }
}

export default UserService;
