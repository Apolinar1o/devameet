import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {user, UserScheme } from "./schemas/user.schemas";
import { Userservice } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    imports: [MongooseModule.forFeature([{name:user.name, schema: UserScheme}])],
    controllers: [UserController],
    providers: [Userservice],
    exports: [MongooseModule, Userservice]
})
export class userModule {

}