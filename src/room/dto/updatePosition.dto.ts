
import { IsNumber, IsString, Max, Min} from "class-validator"
import { joinRoomDto } from "./joinRoom.dto"
import { meetMessageHelpers } from "src/meet/helpers/meetMessageHelpers"

export class updatePositionDto extends joinRoomDto {
    @IsNumber({}, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    @Min(0, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    @Max(8, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    x: number
    @IsNumber({}, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    @Min(0, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    @Max(8, {message: meetMessageHelpers.UPDATE_XY_NOT_VALID})
    y:number
    @IsString({message: meetMessageHelpers.UPDATE_ORIENTATION_NOT_VALID})
    orientation: string
}