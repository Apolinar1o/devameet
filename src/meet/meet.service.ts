import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { meet, meetDocument } from './schemas/meet.schema';
import { Model } from 'mongoose';
import { Userservice } from 'src/user/user.service';
import { getMeetDto } from './dtos/getMeet.dto';
import { createMeetDto } from './dtos/meet.dto';
import { linkGenerator } from './helpers/linkgenerator.helper';
import { meetObject, meetObjectDocument } from './schemas/meetObject.schema';
import { updateMeetDto } from './dtos/uodateMeet.dto';
import { meetMessageHelpers } from './helpers/meetMessageHelpers';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class MeetService {
    private readonly logger = new Logger(MeetService.name)

    constructor(
        @InjectModel(meet.name) private readonly model: Model<meetDocument>,
        @InjectModel(meetObject.name) private readonly Objectmodel: Model<meetObjectDocument>,
        private readonly userService: Userservice
    ){}

    async getMeetByUser(userId: string) {
        this.logger.debug('getmeetsByUser - ' + userId)

        const res =  await this.model.find({user: userId}) 
        console.log(res)
        return res
         
  
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

    async getMeetObjects(meetId: string, userId: string) {
        this.logger.debug("getMeetObjects - " + userId + "- " + meetId)
        const user = await this.userService.getUserById(userId)

        const meet = await this.model.findOne({user, _id: meetId})

        return await this.Objectmodel.find({meet})

    }


    async update(meetId: string, userId: string, dto: updateMeetDto) {

        this.logger.debug("update - " + userId + "- " + meetId)
        const user = await this.userService.getUserById(userId)

        const meet = await this.model.findOne({user, _id: meetId})
        console.log(meet)
        if(!meet) {
            throw new BadRequestException(meetMessageHelpers.UPDATE_MEET_NOT_FOUND)
        }
        meet.name = dto.name
        meet.color = dto.color

        await this.model.findByIdAndUpdate({_id: meetId}, meet)

        await this.Objectmodel.deleteMany({meet})
        
        let ObjectPayload

        for (const object of dto.objects) {
            ObjectPayload = {
                meet,
                ...object
            }
            await this.Objectmodel.create(ObjectPayload)
        }
    }
}

