import { dbConnection } from '@/databases';
import { CreateRoomDto } from '@/dtos/room.dto';
import { createConnection } from 'typeorm';
import RoomService from './rooms.service';

describe('roomService', () => {
  beforeEach(async () => {
    await createConnection(dbConnection);
  });

  it('shoud be created', async () => {
    let roomData: CreateRoomDto = {
      userEmail: 'qwerty@hknu.ac.kr',

      shopName: '맘스터치',
      tipInfos: [
        {
          largerThan: 8000,
          price: 3500,
        },
        {
          largerThan: 20000,
          price: 0,
        },
      ],

      perchaserMenus: [
        {
          name: '싸이버거 세트',
          price: 5900,
        },
        {
          name: '화이트갈릭버거',
          price: 4800,
        },
      ],
    };

    const roomService = new RoomService();

    try {
      const created = await roomService.createRoom(roomData);
      const found = await roomService.findRoomById(1);
      expect(found.shop).toBe(created.shop);
    } catch (err) {
      console.log('\n\n---- Error Raised! ----');
      console.log(err);
    }
  });
});
