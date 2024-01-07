import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { meet, meetDocument } from 'src/meet/schemas/meet.schema';
import { InjectModel } from '@nestjs/mongoose';
import { meetObject, meetObjectDocument } from 'src/meet/schemas/meetObject.schema';
import { position, positionDocument } from './schemas/position.schema';
import { Userservice } from 'src/user/user.service';
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

    async getRoom(link: string) {
        this.logger.debug(`getRoom - ${link}`);

        const meet = (await this._getMeet(link));
        const objects = await this.objectModel.find({meet: meet._id});

        
        return {
            link,
            name: meet.name,
            color: meet.color,
            objects
            
        };
    }

    async listUsersPositionByLink(link: string){
        this.logger.debug(`listUsersPositionByLink - ${link}`);

        const meet = await this._getMeet(link);
        return await this.positionModel.find({meet});
    }

    async deleteUsersPosition(clientId: string){
        this.logger.debug(`deleteUsersPosition - ${clientId}`);
        return await this.positionModel.deleteMany({clientId});
    }

    async updateUserPosition(clientId: string, dto : updatePositionDto){
        this.logger.debug(`listUsersPositionByLink - ${dto.link}`);

        const meet = await this._getMeet(dto.link);
        const user = await this.userservice.getUserById(dto.userId);

        if(!user){
            throw new BadRequestException(roomMessageHelpers.JOIN_USER_NOT_VALID);
        }

        const position = {
            ...dto,
            clientId,
            user,
            meet,
            name: user.name,
            avatar: user.avatar || 'avatar_01'
        }

        const usersInRoom = await this.positionModel.find({meet});
        const loogedUserInRoom = usersInRoom.find(u =>
            u.user.toString() === user._id.toString() || u.clientId === clientId);
        
        if(loogedUserInRoom){
            await this.positionModel.findByIdAndUpdate({_id: loogedUserInRoom._id},position);
        }else{
            if(usersInRoom && usersInRoom.length > 10){
                throw new BadRequestException(roomMessageHelpers.ROOM_MAX_USERS);
            };

            await this.positionModel.create(position);
        }
    }

    async updateUserMute(dto:toggleMute){
        this.logger.debug(`updateUserMute - ${dto.link} - ${dto.userId}`);
        const meet = await this._getMeet(dto.link);
        const user = await this.userservice.getUserById(dto.userId);
        return await this.positionModel.updateMany({user, meet}, {muted: dto.muted});
    }

    async _getMeet(link: string) {
        this.logger.debug(`_getMeet - ${link}`);

        const meet = await this.meetModel.findOne({link});
        if (!meet) {
            
            throw new   BadRequestException(roomMessageHelpers.JOIN_LINK_NOT_VALID);
        }

        return meet;
    }
    async getPos(link: string, userId: string) {
        const meet = await this._getMeet(link);
        const position = await this.positionModel.findOne({ meet, user: userId });
        if (position) {
          const { x, y, orientation } = position;
          return [x, y, orientation];
        }
      }

    async existing(link, userId, ) {
        const exists = await this.positionModel.find({user: userId })
        return exists
    }
}