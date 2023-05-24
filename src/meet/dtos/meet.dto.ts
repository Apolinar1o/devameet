import {  Matches, MinLength, matches, minLength } from "class-validator"
import { meetMessageHelpers } from "../helpers/meetMessageHelpers"

export class createMeetDto {
    @Matches(/[0-9A-Fa-f]{3,6}/, {message: meetMessageHelpers.CREATE_COLOR_NOT_VALID})
    color: string
    @MinLength(2, {message: meetMessageHelpers.CREATE_NAME_NOT_VALID})
    name: string
}