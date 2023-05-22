import {Module} from "@nestjs/common";
import { authController } from "./auth.controller";
import { authService } from "./auth.service";
import { userModule } from "src/user/user.module";
import { jwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";


@Module( {
    imports: [userModule, JwtModule.register({
        secret: process.env.USER_JWT_SECRET_KEY
    })],
    controllers: [authController],
    providers: [authService, jwtStrategy]
})

export class Authmodule {}