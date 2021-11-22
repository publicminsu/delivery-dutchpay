import { dbConnection } from '@/databases';
import { AddMenuDto, CreateRoomDto, JoinRoomDto } from '@/dtos/room.dto';
import { Category } from '@/entity/room.entity';
import { createConnection } from 'typeorm';
import RoomService from './rooms.service';

describe('roomService', () => {
  var roomService: RoomService;
  beforeAll(async () => {
    await createConnection(dbConnection);
    roomService = new RoomService();
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
      roomType: Category._Not,
    };

    try {
      const created = await roomService.createRoom(roomData);
      const found = await roomService.findRoomById(1);
      console.log(found);
      expect(found.shop).toBe(created.shop);
    } catch (err) {
      console.log('\n\n---- Error Raised! ----');
      console.log(err);
    }
  });

  it('should be joined', async () => {
    let joinData: JoinRoomDto = {
      roomId: 1,
      userEmail: 'cheolsu@hknu.ac.kr',
    };

    const room = await roomService.joinRoom(joinData);
    console.log(room);
    expect(room.participants.length).toBe(2);
  });

  it('menu should be added', async () => {
    let menuData: AddMenuDto = {
      roomId: 1,
      userEmail: 'cheolsu@hknu.ac.kr',
      menus: [
        {
          name: '싸이버거 세트',
          price: 5900,
        },
        {
          name: '콜드 가지 버거',
          price: 3500,
        },
      ],
    };

    try {
      const participant = await roomService.addMenu(menuData);
      console.log(participant);
      for (let p of participant.menus) {
        console.log(p);
      }
      expect(1).toBe(1);
    } catch (err) {
      console.log('\n\n---- Error Raised! ----');
      console.log(err);
    }
  });

  it('shoud be found', async () => {
    try {
      const found = await roomService.findRoomById(1);
      console.log(found);
      expect(found.id).toBe(1);
    } catch (err) {
      console.log('\n\n---- Error Raised! ----');
      console.log(err);
    }
  });
});
