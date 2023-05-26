import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { meet, meetDocument } from 'src/meet/schemas/meet.schema';
import { InjectModel } from '@nestjs/mongoose';
import { meetObject, meetObjectDocument } from 'src/meet/schemas/meetObject.schema';
import { position, positionDocument } from './schemas/position.schema';
import { Userservice } from 'src/user/user.service';
import { meetMessageHelpers } from 'src/meet/helpers/meetMessageHelpers';
import { roomMessageHelpers } from './helpers/roomMessagehelpers.helpers';
import { updatePositionDto } from './dto/updatePosition.dto';
import { toggleMute } from './dto/toggleMute.dto';

@Injectable()
export class RoomService {
    private logger = new Logger(RoomService.name)

    constructor(
        @InjectModel(meet.name) private readonly meetModel: Model<meetDocument>,
        @InjectModel(meetObject.name) private readonly objectModel: Model<meetObjectDocument>,
        @InjectModel(position.name) private readonly positionModel: Model<positionDocument>,
        private readonly userservice: Userservice
    ){}

    async getRoom(link:string) {
        this.logger.debug(`getRoom - ${link}`)

        const meet = await this._getMeet(link)
        if(meet) {
            const objects = await this.objectModel.find({meet})

            return {
                link, 
                name: meet.name,
                color: meet.color,
                objects
            }
        }

    }
    async _getMeet(link:string) {
        const meet = await this.meetModel.findOne({link})
        if(!meet) {
            throw new BadRequestException({message: roomMessageHelpers.JOIN_LINK_NOT_VALID})
        }
        return meet
    }

    async listUserPositionByLink(link: string) {
        this.logger.debug(`listUserPositionByLink - ${link}`)

        const meet = await this._getMeet(link)

        return await this.positionModel.find({meet})
    }
    async DeleteUserPosition( clientId: string) {
        this.logger.debug(`DeleteRoom - ${clientId}`)

        const MeetDelete = await this.positionModel.deleteMany({clientId})
    }

    async updateUserPosition(cliendId: string, dto: updatePositionDto) {
        this.logger.debug(`updateUserPosition - ${dto.link}`)

        const meet = await this._getMeet(dto.link)
        const user = await this.userservice.getUserById(dto.userId)

        if(!user) {
            throw new BadRequestException({message: roomMessageHelpers.JOIN_USER_NOT_VALID})
        }

        const position = {
            ...dto,
            cliendId,
            user, 
            meet, 
            name: user.name,
            avatar: user.avatar
        }
        const userInRoom = await this.positionModel.find({meet })

        if(userInRoom && userInRoom.length > 10) {
            throw  new BadRequestException(roomMessageHelpers.ROOM_MAX_USERS)
        }

        const loggedUserInRoom = userInRoom.find(u => 
            u.user.toString() === user._id.toString() || u.clientId === cliendId)
            
            if(loggedUserInRoom) {
                await this.positionModel.findByIdAndUpdate({_id: loggedUserInRoom.id}, position)
            } else {    
                await this.positionModel.create(position)
            }
        }

        async updateUserMute(dto: toggleMute) {
            this.logger.debug(`updateUserMute - ${dto.userId} - ${dto.link}`)

            const meet = await this._getMeet(dto.link)
            const user = await this.userservice.getUserById(dto.userId)
            await this.positionModel.updateMany({user, meet}, {muted: dto.muted})
        }
  
}
