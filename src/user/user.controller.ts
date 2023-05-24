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
    
        console.log("11111111111111111111111111111111111111111111111")

        if(!user) {
            throw new BadRequestException(userMessageHelper.GET_USER_NOT_FOUND)
        }
        console.log("11111111111111111111111111111111111111111111111")
        return {
            name: user.name,
            email: user.email,
            avatar: user.email,
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