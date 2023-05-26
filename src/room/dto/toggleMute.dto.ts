import { IsBoolean} from "class-validator"
import { joinRoomDto } from "./joinRoom.dto"
import { meetMessageHelpers } from "src/meet/helpers/meetMessageHelpers"
import { roomMessageHelpers } from "../helpers/roomMessagehelpers.helpers"

export class toggleMute extends joinRoomDto {
    @IsBoolean({message: roomMessageHelpers.MUTE_NOT_VALID})
    muted: boolean

}