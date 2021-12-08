import { messageDto } from '@/dtos/room.dto';
import { Message } from '@/entity/chat.entity';
import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';
import { ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController } from 'socket-controllers';
import { getRepository } from 'typeorm';

@SocketController()
export class messageController {
  public chatRepository = getRepository(Message);
  @OnConnect()
  connection(@ConnectedSocket() socket: any) {
    console.log('client connected');
  }
  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any) {
    console.log('client disconnected');
  }
  @OnMessage('save')
  save(@ConnectedSocket() socket: any, @MessageBody() message: messageDto) {
    if (isEmpty(message)) throw new HttpException(400, 'Not Message');
    let messageData = new Message();
    messageData.roomId = message.roomId;
    messageData.text = message.text;
    messageData.time = new Date();
    messageData.userId = message.userId;
    console.log('received message:', messageData);
    console.log('setting id to the message and sending it back to the client');
    socket.emit('message_saved', messageData);
    this.chatRepository.save(messageData);
  }
}
