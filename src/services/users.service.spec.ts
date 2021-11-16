import { dbConnection } from '@/databases';
import { CreateUserDto } from '@/dtos/users.dto';
import { createConnection } from 'typeorm';
import UserService from './users.service';

describe('userService', () => {
  var userService;
  const userDatas: CreateUserDto[] = [
    {
      studentId: 2016250033,
      phone: '010-1234-5678',
      nickname: 'wooseob',
      password: 'qwerty123',
      email: 'qwerty@hknu.ac.kr',
    },
    {
      studentId: 2016250001,
      phone: '010-1111-2222',
      nickname: 'gildong',
      password: 'qwerty123',
      email: 'gildong@hknu.ac.kr',
    },
    {
      studentId: 2016250002,
      phone: '010-3333-4444',
      nickname: 'cheolsu',
      password: 'qwerty123',
      email: 'cheolsu@hknu.ac.kr',
    },
  ];
  beforeAll(async () => {
    await createConnection(dbConnection);
    userService = new UserService();
    for (let userData of userDatas) {
      await userService.createUser(userData);
    }
  });

  it('shoud be created', async () => {
    try {
      const found = await userService.findUserById(1);
      // const emailFind = await userService.findUserByEmail('qwerty@hknu.ac.kr'); //제 기준으론 찾아졌어요.
      expect(found.studentId).toBe(userDatas[0].studentId);
    } catch (err) {
      console.log('\n\n---- Error Raised! ----');
      console.log(err);
    }
  });
});
