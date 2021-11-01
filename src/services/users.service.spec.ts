import { dbConnection } from '@/databases';
import { CreateUserDto } from '@/dtos/users.dto';
import { createConnection } from 'typeorm';
import UserService from './users.service';

describe('userService', () => {
  beforeEach(async () => {
    await createConnection(dbConnection);
  });

  it('shoud be created', async () => {
    let userData: CreateUserDto = {
      studentId: 2016250033,
      phone: '010-1234-5678',
      nickname: 'wooseob',
      password: 'qwerty123',
      email: 'qwert',
    };

    const userService = new UserService();

    try {
      const created = await userService.createUser(userData);
      const found = await userService.findUserById(1);
      const emailFind=await userService.findUserByEmail("qwerty@hknu.ac.kr");//제 기준으론 찾아졌어요.
      expect(found.studentId).toBe(created.studentId);
    } catch (err) {
      console.log('\n\n---- Error Raised! ----');
      console.log(err);
    }
  });
});
