import { WebSocketServer, SubscribeMessage , WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { type } from 'os';
import { joinRoomDto } from './dto/joinRoom.dto';
import {updatePositionDto } from "./dto/updatePosition.dto"
import { toggleMute } from './dto/toggleMute.dto';

type activeSocketType = {
  room: string, 
  id: String, 
  userId: string
}

@WebSocketGateway({cors: true})
export class RoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly service:RoomService){}

 
  @WebSocketServer() wss: Server

  private logger = new Logger(RoomGateway.name)
  private activeSockets: activeSocketType[] = []

  async handleDisconnect(client: any, ...arg:any[]) {

    const existingSocket = this.activeSockets.find(
      socket=> socket.id ===client.id
    )
    if(!existingSocket) return

    this.activeSockets = this.activeSockets.filter(
      socket=> socket.id !==client.id
    )

    await this.service.DeleteUserPosition(client.id)
    client.broadcast.emit(`${existingSocket.room}-remove-user`, {sockedId: client.id})
    
    this.logger.debug(`Client: ${client.id} disconnected `)
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.debug(`Client: ${client.id} connected`)
  }

  afterInit(server: any) {
    this.logger.log("Gateway Initialized")
  }
  @SubscribeMessage("join") 
  async handleJoin ( client: Socket, payload: joinRoomDto) {
    const {link, userId} = payload

    const existingOnSocket =  this.activeSockets.find( async socket => {
      socket.room === link && socket.id === client.id

      if(!existingOnSocket) {
        this.activeSockets.push({room:link, id: client.id, userId})

        const dto = {
          link, 
          userId, 
          x: 2, 
          y: 2, 
          orientation:"down"
        } as updatePositionDto
          
        await this.service.updateUserPosition(client.id, dto)
        const user = await this.service.listUserPositionByLink(link)
        
        this.wss.emit(`${link}-update-user-list`, {user})
        client.broadcast.emit(`${link}-add-user` , {user:client.id})
        
      }
      this.logger.debug(`Socket client: ${client.id} start to join room ${link}`)
    } )
  }
  @SubscribeMessage("move") 
  async handleMove ( client: Socket, payload: updatePositionDto) {
    const {link, userId, x, y, orientation} = payload
        const dto = {
          link, 
          userId, 
          x: 2, 
          y: 2, 
          orientation:"down"
        } as updatePositionDto
        
      await this.service.updateUserPosition(client.id, dto)
        const user = await this.service.listUserPositionByLink(link)
        
        this.wss.emit(`${link}-update-user-list`, {user})
  }
  @SubscribeMessage("toogle-mute-user") 
  async handleToggleMute ( client: Socket, payload: toggleMute) {
    const {link} = payload   
      await this.service.updateUserMute(payload)
        const user = await this.service.listUserPositionByLink(link)
        this.wss.emit(`${link}-update-user-list`, {user})
  }

  @SubscribeMessage("call-user") 
  async callUSer ( client: Socket, data: any) {
  this.logger.debug(`callUUser: ${client.id} to: ${data.to}`)
  client.to(data.to).emit("call-made", {
    offer: data.offer,
    socket: client.to
  }) 
  }

  @SubscribeMessage("make-answer") 
  async makeAnswer ( client: Socket, data: any) {
  this.logger.debug(`makeAnswer: ${client.id} to: ${data.to}`)
  client.to(data.to).emit("makeAnswer", {
    answer: data.answer,
    socket: client.to
  }) 
}
}
