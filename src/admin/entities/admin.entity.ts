import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import{ Document, SchemaTypes, Types} from "mongoose";

@Schema({timestamps: true})
export class Admin extends Document{

    role: string;

    @Prop({required: true})
    adresse: string;

}

export const AdminSchema = SchemaFactory.createForClass(Admin);