import { IsString, MinLength, minLength } from "class-validator"
import { userMessageHelper } from "../helpers/messages.helper"

export class updateUSerDto {
    @MinLength(2, {message: userMessageHelper.REGISTER_NAME_NOT_VALID})
    name: string
    @IsString()
    avatar: string
}