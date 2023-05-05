import { Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import { authService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { registerDto } from 'src/user/dtos/register.dto';

@Controller("auth")
export class authController {
   
    constructor(private readonly authService: authService){}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto){
        return this.authService.login(dto)
    }
    @Post("register")
    @HttpCode(HttpStatus.OK)
    register(@Body() dto: registerDto){
        return this.authService.register(dto)
    }




}