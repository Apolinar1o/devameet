import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsString} from "class-validator"
import { userMessageHelper } from "../helpers/messages.helper"

export class registerDto {
    @IsNotEmpty({message: userMessageHelper.REGISTER_NAME_NOT_VALID})
    name:string 
    @IsEmail({}, {message: "email invalido"})
    email:string
    @MinLength(4, { message: "minimo não atingido"})
    @MaxLength(12, { message: "maximo não atingido"})
    @Matches((/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/), {message: userMessageHelper.REGISTER_PASSWORD_NOT_VALID})
    senha:string
    @IsString()
    avatar:string
}