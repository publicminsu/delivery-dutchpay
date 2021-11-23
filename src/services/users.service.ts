import bcrypt, { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { User } from '@/entity/user.entity';
import { getRepository } from 'typeorm';
import { Room } from '@/entity/room.entity';
import { Report } from '@/entity/report.entity';

class UserService {
  public userRepository = getRepository(User);
  public roomRepository = getRepository(Room);
  public reportRepository = getRepository(Report);

  public async findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findUserById(userId: number): Promise<User> {
    //스튜던트 아이디
    const findUser: User = await this.userRepository.findOne({ studentId: userId });
    if (!findUser) throw new HttpException(409, "You're not user");
    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const emailExist: User = await this.userRepository.findOne({ email: userData.email });
    if (emailExist) throw new HttpException(409, `Your email ${userData.email} already exists`);

    const studentIdExist: User = await this.userRepository.findOne({ studentId: userData.studentId });
    if (studentIdExist) throw new HttpException(409, `Your studentId ${userData.studentId} already exists`);

    const phoneExist: User = await this.userRepository.findOne({ phone: userData.phone });
    if (phoneExist) throw new HttpException(409, `Your studentId ${userData.phone} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = new User();
    user.update(userData);

    let saved;
    try {
      saved = await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
    }

    return saved;
  }

  public async updateUser(userData: CreateUserDto): Promise<User[]> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.userRepository.findOne({ studentId: userData.studentId });
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    findUser.update(userData);

    await this.userRepository.save(findUser);
    return this.findAllUser();
  }

  public async deleteUser(userId: number): Promise<User[]> {
    const findUser: User = await this.userRepository.findOne({ studentId: userId });
    if (!findUser) throw new HttpException(409, "You're not user");

    await this.userRepository.delete({ studentId: userId });
    return this.findAllUser();
  }
  public async reportUser(accuserId: number, defendantId: number, roomId: number, reportType: number) {
    const findAccuser: User = await this.userRepository.findOne({ studentId: accuserId });
    const findDefendant: User = await this.userRepository.findOne({ studentId: defendantId });
    const findRoom: Room = await this.roomRepository.findOne(roomId);
    if (!findAccuser || !findDefendant || !findRoom) throw new HttpException(409, 'Wrong Report');
    const report = new Report();
    report.accuser = findAccuser;
    report.defendant = findDefendant;
    report.room = findRoom;
    report.reportType = reportType;
    await this.reportRepository.save(report);
  }
}

export default UserService;
