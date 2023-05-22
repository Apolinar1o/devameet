import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true, 
            secretOrKey: process.env.USER_JWT_SECRET_KEY

        })
    }

        async validate(payload:any){
            return {userid: payload.sub, email:payload.email}
        }
}