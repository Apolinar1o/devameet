import { Controller, Get, Request, Post, Body, Delete, Param,} from '@nestjs/common';
import { MeetService } from './meet.service';
import { getMeetDto } from './dtos/getMeet.dto';
import { createMeetDto } from './dtos/meet.dto';

@Controller('meet')
export class MeetController {
    constructor(
        private readonly service: MeetService
    ){}

    @Get()
    async getUser(@Request() req) {
        const {userId} = req?.user

        const result = await this.service.getMeetByUser(userId)

        return result.map(m => ({
             id: m._id.toString(),
             name: m.name,
             color: m.color,
             link: m.link
             
            } 
            ) as getMeetDto)
    }
    @Post()
    async createMeet(@Request() req, @Body() dto: createMeetDto) {
        const {userId} = req?.user
        await this.service.createMeet(userId, dto)

    }
    @Delete(":id")
    async deleteMeetByUser(@Request() req, @Param() params) {
        const {userId} = req?.user
        const {id} = params
        await this.service.deleteMeetByUser(userId, id)

    }
}
