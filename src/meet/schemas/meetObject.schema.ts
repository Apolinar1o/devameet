import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { meet } from "./meet.schema";
import mongoose, { HydratedDocument } from "mongoose";
export type meetObjectDocument = HydratedDocument<meetObject>
@Schema()
export class meetObject {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: meet.name})
    meet: meet
    @Prop({required: true})
    x: number
    @Prop({required: true})
    y: number
    @Prop({required: true})
    zindex: number
    @Prop({required: true})

    orientation: string    
    @Prop()
    name: string

}

export const meetObjectSchema = SchemaFactory.createForClass(meetObject)