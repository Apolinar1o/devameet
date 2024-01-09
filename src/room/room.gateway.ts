import { WebSocketServer, SubscribeMessage , WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { BadRequestException, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { joinRoomDto } from './dto/joinRoom.dto';
import {updatePositionDto } from "./dto/updatePosition.dto"
import { toggleMute } from './dto/toggleMute.dto';
import { PositionGenerate } from './helpers/generatePosition';




type ActiveSocketType = {
  room: String;
  id: string;
  userId: string;
}

@WebSocketGateway({ cors: true })
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect {

  constructor(private readonly service: RoomService) { }

  @WebSocketServer() wss: Server;

  private logger = new Logger(RoomGateway.name);
  private activeSockets: ActiveSocketType[] = [];

  async handleDisconnect(client: any) {
    const existingOnSocket = this.activeSockets.find(
      socket => socket.id === client.id
    );

    if (!existingOnSocket) return;

    this.activeSockets = this.activeSockets.filter(
      socket => socket.id !== client.id
    );

    await this.service.deleteUsersPosition(client.id);
    client.broadcast.emit(`${existingOnSocket.room}-remove-user`, { socketId: client.id });

    this.logger.debug(`Client: ${client.id} disconnected`);
  }

  afterInit(server: any) {
    this.logger.log('Gateway initialized');
  }

  @SubscribeMessage('join')
async handleJoin(client: Socket, payload: joinRoomDto) {
  const { link, userId } = payload;

  const existingSocket = this.activeSockets.find(
    (socket) => socket.room === link && socket.userId === userId,
  );
  //  const existing = await this.service.existing(link, userId)
  //caso não seja a primeira bez
  console.log(client + " " + client.id)
  if (!existingSocket) {
    this.activeSockets.push({ room: link, id: client.id, userId });

    const pos = await this.service.getPos(link, userId);
    console.log(pos +" 1123123")
    if(pos) {
      const dto = {
        link,
        userId,
        x: pos[0],
        y: pos[1],
        orientation: pos[2]
      } as updatePositionDto

      await this.service.updateUserPosition(client.id, dto);

    }
    else {
      //caso seja a primeira vez
      const dto = {
        link,
        userId,
        x: PositionGenerate(),
        y: PositionGenerate(),
        orientation: 'front'
      } as updatePositionDto;

      await this.service.updateUserPosition(client.id, dto);
    } 
    
  }
  else {
    console.log("++++++++++++++++++++++++++++++++++")
    // Se não houver um socket existente, gere uma nova posição e atualize-a no banco de dados
    this.activeSockets.push({ room: link, id: client.id, userId });

    const dto = {
      link,
      userId,
      x: PositionGenerate(),
      y: PositionGenerate(),
      orientation: 'front'
    } as updatePositionDto;

    await this.service.updateUserPosition(client.id, dto);
  }

  const users = await this.service.listUsersPositionByLink(link);
  this.wss.emit(`${link}-update-user-list`, { users });

  if (!existingSocket) {
    client.broadcast.emit(`${link}-add-user`, { user: client.id });
  }
  this.logger.debug(`Socket client: ${client.id} start to join room ${link}`);
}


@SubscribeMessage('move')
async handleMove(client: Socket, payload: updatePositionDto) {
  const { link, userId, x, y, orientation } = payload;
  const dto = {
    link,
    userId,
    x,
    y,
    orientation
  } as updatePositionDto

  await this.service.updateUserPosition(client.id, dto);
  const users = await this.service.listUsersPositionByLink(link);
  this.wss.emit(`${link}-update-user-list`, { users });
}

  @SubscribeMessage('toggl-mute-user')
  async handleToglMute(_: Socket, payload: toggleMute) {
    const { link } = payload;
    console.log("toggle mute comecou")
    await this.service.updateUserMute(payload);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, { users });
  }

  @SubscribeMessage('call-user')
  async callUser(client: Socket, data: any) {
    this.logger.debug(`callUser: ${client.id} to: ${data.to}`);
    client.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: client.id
    });
  }


  @SubscribeMessage('make-answer')
  async makeAnswer(client: Socket, data: any) {
    this.logger.debug(`makeAnswer: ${client.id} to: ${data.to}`);
    client.to(data.to).emit('answer-made', {
      answer: data.answer,
      socket: client.id
    });
  }
}