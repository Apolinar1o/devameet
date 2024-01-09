import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { meet } from "src/meet/schemas/meet.schema"
import { user } from "src/user/schemas/user.schemas"

export type positionDocument = HydratedDocument<position>

@Schema()
export class position {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: meet.name})
    meet: meet
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: meet.name})
    user: user
    @Prop({required: true})
    name: string
    @Prop({required: true})
    avatar: string
    @Prop({required: true})
    clientId: string
    @Prop({required: true})
    x:number
    @Prop({required: true})
    y:number
    @Prop({required: true})
    orientation: string
    @Prop({default: false})
    muted: boolean

}
export const positionSchema = SchemaFactory.createForClass(position)
