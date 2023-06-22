import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type userDOcument = HydratedDocument<user>

@Schema()
export class user {
    @Prop({required:true})
    name:string
    @Prop({required:true})
    email:string
    @Prop({required:true})
    senha:string
    @Prop()
    avatar:string
}

export const UserScheme = SchemaFactory.createForClass(user)