import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { User } from '@/entity/user.entity';
import { getRepository } from 'typeorm';
import { Category, Room } from '@/entity/room.entity';
import { AddMenuDto, CreateRoomDto, JoinRoomDto } from '@/dtos/room.dto';
import { Tip } from '@/entity/tip.entity';
import { Menu } from '@/entity/menu.entity';
import { Participant } from '@/entity/participant.entity';

class RoomService {
  public userRepository = getRepository(User);
  public roomRepository = getRepository(Room);
  public tipRepository = getRepository(Tip);
  public menuRepository = getRepository(Menu);
  public participantRepository = getRepository(Participant);

  public async findAllRoom(): Promise<Room[]> {
    return this.roomRepository.find({ isActive: true });
  }
  public async findRoomByCategory(category: Category): Promise<Room[]> {
    return this.roomRepository.find({ isActive: true, roomType: category });
  }

  public async findRoomById(roomId: number): Promise<Room> {
    const findRoom: Room = await this.roomRepository.findOne(roomId);
    if (!findRoom) throw new HttpException(409, 'no room');
    if (!findRoom.isActive) throw new HttpException(409, 'deactivated room');

    return findRoom;
  }

  public async createRoom(roomData: CreateRoomDto): Promise<Room> {
    if (isEmpty(roomData)) throw new HttpException(400, 'invalid CreateRoomDto');

    const purchaser = await this.userRepository.findOne({ email: roomData.userEmail });

    const newRoom = new Room();
    newRoom.date = new Date();
    newRoom.shop = roomData.shopName;
    newRoom.purchaser = purchaser;

    await this.roomRepository.save(newRoom);

    for (const tipInfo of roomData.tipInfos) {
      let tip = new Tip();
      tip.largerThan = tipInfo.largerThan;
      tip.price = tipInfo.price;
      tip.room = newRoom;
      await this.tipRepository.save(tip);
    }

    let purchaserInfo = new Participant();
    purchaserInfo.room = newRoom;
    purchaserInfo.user = purchaser;
    purchaserInfo = await this.participantRepository.save(purchaserInfo);

    const menus: Menu[] = [];
    for (const menuInfo of roomData.perchaserMenus) {
      let menu = new Menu();
      menu.menu = menuInfo.name;
      menu.price = menuInfo.price;
      menu.participantId = purchaserInfo.id;
      menus.push(menu);
    }

    purchaserInfo.menus = menus;
    newRoom.participants = [purchaserInfo];
    newRoom.roomType = roomData.roomType;
    return await this.roomRepository.save(newRoom);
  }

  public async joinRoom(joinData: JoinRoomDto): Promise<Room> {
    if (isEmpty(joinData)) throw new HttpException(400, 'invalid JoinRoomDto');

    const joinUser = await this.userRepository.findOne({ email: joinData.userEmail });
    const targetRoom = await this.findRoomById(joinData.roomId);

    const participantInfo = new Participant();
    participantInfo.room = targetRoom;
    participantInfo.user = joinUser;

    targetRoom.participants.push(participantInfo);
    return await this.roomRepository.save(targetRoom);
  }
  public async endRoom(roomId: number) {
    const targetRoom = await this.findRoomById(roomId);
    targetRoom.isActive = false;
    return await this.roomRepository.save(targetRoom);
  }
  public async addMenu(addMenuData: AddMenuDto): Promise<Participant> {
    if (isEmpty(addMenuData)) throw new HttpException(400, 'invalid AddMenuDto');

    const joinUser = await this.userRepository.findOne({ email: addMenuData.userEmail });
    const targetRoom = await this.findRoomById(addMenuData.roomId);

    const participantInfo = await this.participantRepository.findOne({ room: targetRoom, user: joinUser });

    for (const menuInfo of addMenuData.menus) {
      let menu = new Menu();
      menu.menu = menuInfo.name;
      menu.price = menuInfo.price;
      menu.participantId = participantInfo.id;
      participantInfo.menus.push(menu);
    }

    return await this.participantRepository.save(participantInfo);
  }
  public async createPurchaseMenu(file: Express.Multer.File, roomId: number): Promise<Room> {
    const targetRoom = await this.findRoomById(roomId);
    targetRoom.imagePath = file.path;
    return await this.roomRepository.save(targetRoom);
  }
  public async getPurchaseMenu(roomId: number): Promise<string> {
    const targetRoom = await this.findRoomById(roomId);
    const imagePath = targetRoom.imagePath;
    if (!imagePath) throw new HttpException(400, 'invalid image');
    return imagePath;
  }
}

export default RoomService;
