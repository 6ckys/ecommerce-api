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

    @Prop([{type: SchemaTypes.ObjectId, ref: 'Subcategories'}])
    subcategories: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity);