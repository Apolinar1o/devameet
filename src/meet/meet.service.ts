import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { meet, meetDocument } from './schemas/meet.schema';
import { Model } from 'mongoose';
import { Userservice } from 'src/user/user.service';
import { getMeetDto } from './dtos/getMeet.dto';
import { createMeetDto } from './dtos/meet.dto';
import { linkGenerator } from './helpers/linkgenerator.helper';

@Injectable()
export class MeetService {
    private readonly logger = new Logger(MeetService.name)

    constructor(
        @InjectModel(meet.name) private readonly model: Model<meetDocument>,
        private readonly userService: Userservice
    ){}

    async getMeetByUser(userId: string) {
        this.logger.debug('getmeetsByUser - ' + userId)
        return await this.model.find({user: userId}) 
    }

    async createMeet(userId: string, dto: createMeetDto) {
        this.logger.debug("createMeet - " + userId)
        
        const user = await this.userService.getUserById(userId)

        const meet = {
            ...dto,
            user, 
            link: linkGenerator(),

        }
        const createdMeet = new this.model(meet)
        return await createdMeet.save()
    }
    
    async deleteMeetByUser(userId: string, meetId: string) {
        this.logger.debug("deleteMeetByUser - " + userId + "- " + meetId)
        
        const user = await this.model.deleteOne({user: userId, _id: meetId})

    }
}

