import {Get, Request, Controller, BadRequestException, Put, Body, HttpCode, HttpStatus} from "@nestjs/common"
import { Userservice } from "./user.service";
import { userMessageHelper } from "./helpers/messages.helper";

@Controller("user")
export class userController  {
    constructor(private readonly userService: Userservice ){}

    @Get()
    async getUser(@Request() req) {
        const {userid} = req?.user
        const user = await this.userService.getUserById(userid)
    
        console.log(user +" 123123")
        if(!user) {
            throw new BadRequestException(userMessageHelper.GET_USER_NOT_FOUND)
        }
        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            id: user._id
        }
    }
    @Put()
    @HttpCode(HttpStatus.OK) 
    async uodateUser(@Request() req, @Body() dto) {
            const {userid} = req?.user
            await this.userService.updateUser(userid, dto)
            
            return {message: userMessageHelper.UPDATE_SUCCESFULY}

        
    }
} 