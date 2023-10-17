import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import{ Document, SchemaTypes, Types} from "mongoose";
import * as argon2 from 'argon2';

@Schema({timestamps: true, discriminatorKey: "role"})
export class User extends Document{

    @Prop({required: true, unique: true})
    username: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({required: true})
    phone: string;

    @Prop({required: true})
    photo: string;

    @Prop()
    RefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User).pre("save", async function () {
    this.password = await argon2.hash(this.password);
});