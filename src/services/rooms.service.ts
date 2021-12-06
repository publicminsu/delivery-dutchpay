import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { User } from '@/entity/user.entity';
import { getRepository } from 'typeorm';
import { Category, Room } from '@/entity/room.entity';
import { AddMenuDto, AgreementDto, CreateRoomDto } from '@/dtos/room.dto';
import { Tip } from '@/entity/tip.entity';
import { Menu } from '@/entity/menu.entity';
import { agreement, Participant } from '@/entity/participant.entity';

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

  public async createRoom(user: User, roomData: CreateRoomDto): Promise<Room> {
    if (isEmpty(roomData)) throw new HttpException(400, 'invalid CreateRoomDto');

    const findUser: User = await this.userRepository.findOne({ email: user.email });
    const purchaser = findUser;

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

  public async joinRoom(user: User, roomId: number): Promise<Room> {
    const joinUser = await this.userRepository.findOne({ email: user.email });
    const targetRoom = await this.findRoomById(roomId);
    if (!targetRoom.isActive) throw new HttpException(400, 'Deactivated Room');
    for (let i = 0; i < targetRoom.participants.length; i++) {
      if (targetRoom.participants[i].id === joinUser.id) throw new HttpException(400, 'already join');
    }
    const participantInfo = new Participant();
    participantInfo.room = targetRoom;
    participantInfo.user = joinUser;
    targetRoom.participants.push(participantInfo);
    return await this.roomRepository.save(targetRoom);
  }
  public async changeMaster(user: User, roomId: number, userId: number): Promise<Room> {
    const joinUser = await this.userRepository.findOne({ email: user.email });
    const findUser: User = await this.userRepository.findOne({ studentId: userId });
    const targetRoom = await this.findRoomById(roomId);
    let isRoomUser: boolean = false;
    if (!targetRoom.isActive) throw new HttpException(400, 'Deactivated Room');
    if (targetRoom.purchaser.id !== joinUser.id) throw new HttpException(400, 'You are Not purchaser');
    for (let i = 0; i < targetRoom.participants.length; i++)
      if (targetRoom.participants[i].id === findUser.id) {
        isRoomUser = true;
        break;
      }
    if (!isRoomUser) throw new HttpException(400, 'Target User is Not Room User');
    targetRoom.purchaser = findUser;
    return await this.roomRepository.save(targetRoom);
  }
  public async leaveRoom(user: User, roomId: number): Promise<Room> {
    const findUser = await this.userRepository.findOne({ email: user.email });
    const targetRoom = await this.findRoomById(roomId);
    if (!targetRoom) throw new HttpException(409, 'no Room');
    if (!targetRoom.isActive) throw new HttpException(400, 'Deactivated Room');
    if (targetRoom.purchaser.id === findUser.id) throw new HttpException(400, 'Give master to another user');
    //메뉴 삭제는 차후에 생각. 필요한지?
    for (let i = 0; i < targetRoom.participants.length; i++) {
      if (targetRoom.participants[i].user.id === findUser.id) {
        targetRoom.participants.splice(i, 1);
        break;
      }
    }
    return await this.roomRepository.save(targetRoom);
  }

  public async endRoom(roomId: number) {
    const targetRoom = await this.findRoomById(roomId);
    targetRoom.isActive = false;
    return await this.roomRepository.save(targetRoom);
  }
  public async addMenu(user: User, roomId: number, addMenuData: AddMenuDto): Promise<Participant> {
    if (isEmpty(addMenuData)) throw new HttpException(400, 'invalid AddMenuDto');

    const joinUser = await this.userRepository.findOne({ email: user.email });
    const targetRoom = await this.findRoomById(roomId);

    const participantInfo = await this.participantRepository.findOne({ room: targetRoom, user: joinUser });
    if (!participantInfo) throw new HttpException(409, 'no participant');

    for (const menuInfo of addMenuData.menus) {
      let menu = new Menu();
      menu.menu = menuInfo.name;
      menu.price = menuInfo.price;
      menu.participantId = participantInfo.id;
      participantInfo.menus.push(menu);
    }

    return await this.participantRepository.save(participantInfo);
  }
  public async deleteMenu(user: User, roomId: number, menuId: number): Promise<Participant> {
    //if (isEmpty(deleteMenuData)) throw new HttpException(400, 'invalid DeleteMenuDto');
    const joinUser = await this.userRepository.findOne({ email: user.email });
    const targetRoom = await this.findRoomById(roomId);
    const participantInfo = await this.participantRepository.findOne({ room: targetRoom, user: joinUser });
    if (!participantInfo) throw new HttpException(409, 'no participant');
    const menuData = await this.menuRepository.findOne(menuId);
    for (let i = 0; i < participantInfo.menus.length; i++) {
      if (participantInfo.menus[i].id === menuData.id) {
        participantInfo.menus.splice(i, 1);
        break;
      }
    }
    await this.menuRepository.remove(menuData);
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
  public async selectedAgreement(user: User, roomId: number, roomData: AgreementDto): Promise<Participant> {
    if (isEmpty(roomData)) throw new HttpException(400, 'invalid AgreementDto');
    const joinUser = await this.userRepository.findOne({ email: user.email });
    const targetRoom = await this.findRoomById(roomId);
    const participantInfo = await this.participantRepository.findOne({ room: targetRoom, user: joinUser });
    if (!participantInfo) throw new HttpException(409, 'no participant');
    if (roomData.bool) participantInfo.agreement = agreement.True;
    else participantInfo.agreement = agreement.False;
    return await this.participantRepository.save(participantInfo);
  }
  public async initAgreement(roomId: number): Promise<Room> {
    const targetRoom = await this.findRoomById(roomId);
    if (!targetRoom) throw new HttpException(409, 'no Room');
    for (let i = 0; i < targetRoom.participants.length; i++) {
      targetRoom.participants[i].agreement = agreement._Not;
    }
    return await this.roomRepository.save(targetRoom);
  }
}

export default RoomService;
