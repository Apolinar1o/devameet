import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type userDOcument = HydratedDocument<user>

@Schema()
export class user {
    @Prop({required:true})
    name:String
    @Prop({required:true})
    email:String
    @Prop({required:true})
    senha:String
    @Prop()
    avatar:String
}

export const UserScheme = SchemaFactory.createForClass(user )