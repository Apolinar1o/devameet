import { registerDto } from "src/user/dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { MessagesHelper } from "./helpers/messages.helper";
import { BadRequestException, Injectable, Logger} from "@nestjs/common"
import { Userservice } from "src/user/user.service";
import { userMessageHelper } from "src/user/helpers/messages.helper";
import { JwtService } from "@nestjs/jwt/dist";


@Injectable()
export class authService {
    private logger = new Logger(authService.name)

    constructor(private readonly userService: Userservice,
        private readonly jwtService: JwtService
        ){}
    
    async login(dto: LoginDto) {
        this.logger.debug("login = start")
        
        const user = await this.userService.getUserByLoginPassword(dto.login, dto.senha)
        if(user == null) {
            throw new BadRequestException(MessagesHelper.AUTH_PASSWORD_OR_LOGIN_NOT_FUND)
        }
        const tokenPayload = {email:user.email, sub: user._id}
        return {
            email:user.email,
            name: user.name, 
            token: this.jwtService.sign(tokenPayload, {secret: process.env.USER_JWT_SECRET_KEY})
        }
    }
    async register(dto: registerDto) {
        this.logger.debug("register = started")
        if(await this.userService.existsByemail(dto.email)){
            console.log("+===================================================")
            throw new BadRequestException(userMessageHelper.REGISTER_EXIST_EMAIL_ACCOUNT)
            console.log("--------------------------------------------------")
         

        }
        await this.userService.create(dto)
    }
}