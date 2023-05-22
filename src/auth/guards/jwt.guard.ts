import { Injectable, ExecutionContext, UnauthorizedException} from "@nestjs/common";
import {AuthGuard } from "@nestjs/passport"
import {Reflector } from "@nestjs/core"
import { IS_PUBLIC_KEY } from "../decorators/ispublic.decorators";



@Injectable()
export class jwtAuthGuard extends AuthGuard("jwt") {
    constructor (private reflector: Reflector){
        super()
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean> (
            IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
            if(isPublic) {
                return true
            }

        const canActivate = super.canActivate(context)

        if(typeof canActivate ==="boolean") {
            return canActivate
        }
        const canActivatePromisse = canActivate as Promise<boolean>

        return canActivatePromisse.catch(error => {
            if(error && error.message) {

                throw new UnauthorizedException(error.message)
            }

            throw new UnauthorizedException()
        })
    }
}