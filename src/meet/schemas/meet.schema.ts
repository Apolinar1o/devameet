import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { user} from "src/user/schemas/user.schemas";
export type meetDocument = HydratedDocument<meet>
@Schema()
export class meet {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "user"})
    user: user

    @Prop({required: true})
    name: String

    @Prop({required: true})
    color: String

    @Prop({required: true})
    link: String
    
}

export const meetSchema  = SchemaFactory.createForClass(meet)