import { IsNotEmpty, isNotEmpty } from "class-validator"
import { roomMessageHelpers } from "../helpers/roomMessagehelpers.helpers"

export class joinRoomDto {
    @IsNotEmpty({message: roomMessageHelpers.JOIN_USER_NOT_VALID})
    userId: string
    @IsNotEmpty({message: roomMessageHelpers.JOIN_LINK_NOT_VALID})
    link: string
}