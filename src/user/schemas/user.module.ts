import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {user, UserScheme } from "./user.schemas";
import { Userservice } from "../user.service";

@Module({
    imports: [MongooseModule.forFeature([{name:user.name, schema: UserScheme}])],
    controllers: [],
    providers: [Userservice],
    exports: [MongooseModule, Userservice]
})
export class userModule {

}