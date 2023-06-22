import { Controller, Get, Request, Post, Body, Delete, Param, Put} from '@nestjs/common';
import { MeetService } from './meet.service';
import { getMeetDto } from './dtos/getMeet.dto';
import { createMeetDto } from './dtos/meet.dto';
import { updateMeetDto } from './dtos/uodateMeet.dto';

@Controller('meet')
export class MeetController {
    constructor(
        private readonly service: MeetService
    ){}

    @Get()
    async getUser(@Request() req) {
        const {userid} = req?.user

        const result = await this.service.getMeetByUser(userid)
        return result.map(m => ({
             id: m._id.toString(),
             name: m.name,
             color: m.color,
             link: m.link
             
            } 
            )  as getMeetDto)

        
         
    }
    @Post()

    async createMeet(@Request() req, @Body() dto: createMeetDto) {
        const {userid} = req?.user
        await this.service.createMeet(userid, dto)

    }


    @Delete(":id")
    async deleteMeetByUser(@Request() req, @Param() params) {
  
            const {userid} = req?.user
    
        const {id} = params
        await this.service.deleteMeetByUser(userid, id)

    }
    @Get("objects/:id")
    async getObjectByMeetId(@Request() req, @Param() params) {
  
        const {userid} = req?.user
        const {id} = params
        return await this.service.getMeetObjects(id, userid)
 }


 @Put(":id")
    async UpdateMeet(@Request() req, @Param() params, @Body() dto: updateMeetDto) {
  
        const {userid} = req?.user
        const {id} = params
    
        await this.service.update(id, userid, dto)
       


    }
}
