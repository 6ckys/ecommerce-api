import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import{ Document, SchemaTypes, Types} from "mongoose";

@Schema({timestamps: true})
export class CategoryEntity extends Document{

    @Prop({required: true, unique: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    file: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity);