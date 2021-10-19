import bcrypt, { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { UserEntity } from '@/entity/user.entity';
import { getRepository } from 'typeorm';
import { RoomEntity } from '@/entity/room.entity';
import { CreateRoomDto } from '@/dtos/room.dto';
import { TipEntity } from '@/entity/tip.entity';
import { MenuEntity } from '@/entity/menu.entity';

class RoomService {
  public userRepository = getRepository(UserEntity);
  public roomRepository = getRepository(RoomEntity);
  public tipRepository = getRepository(TipEntity);
  public menuRepository = getRepository(MenuEntity);

  public async findAllRoom(): Promise<RoomEntity[]> {
    return this.roomRepository.find();
  }

  public async findRoomById(roomId: number): Promise<RoomEntity> {
    const findRoom: RoomEntity = await this.roomRepository.findOne(roomId);
    if (!findRoom) throw new HttpException(409, "You're not user");

    return findRoom;
  }

  public async createRoom(roomData: CreateRoomDto): Promise<RoomEntity> {
    if (isEmpty(roomData)) throw new HttpException(400, "You're not userData");

    const perchaser = await this.userRepository.findOne(roomData.userEmail);

    const newRoom = new RoomEntity();
    newRoom.date = new Date();
    newRoom.shop = roomData.shopName;
    newRoom.totalPrice = 0;
    newRoom.perchaser = perchaser;

    const saved = await this.roomRepository.save(newRoom);

    for (const tipInfo of roomData.tipInfos) {
      let tip = new TipEntity();
      tip.largerThan = tipInfo.largerThan;
      tip.price = tipInfo.price;
      tip.room = newRoom;
      await this.tipRepository.save(tip);
    }

    for (const menuInfo of roomData.perchaserMenus) {
      let menu = new MenuEntity();
      menu.room = newRoom;
      menu.user = perchaser;
      menu.menu = menuInfo.name;
      menu.price = menuInfo.price;
      await this.menuRepository.save(menu);
    }

    return saved;
  }
}

export default RoomService;
