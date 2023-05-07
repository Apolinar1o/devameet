import {Controller, Get, Request, BadRequestException} from "@nestjs/common"
import { Userservice } from "./user.service";
import { userMessageHelper } from "./helpers/messages.helper";


@Controller("user")
export class UserController {
    constructor(private readonly userService:Userservice){}

    @Get()
    async getUser(@Request() req) {
        const {userId} = req?.user
        const user = await this.userService.getUserByid(userId)

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
}