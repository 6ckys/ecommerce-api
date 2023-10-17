import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import{ Document, SchemaTypes, Types} from "mongoose";

@Schema({timestamps: true})
export class SubcategoryEntity extends Document{

    @Prop({required: true, unique: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'categories', required: true})
    category!: Types.ObjectId;

    @Prop([{ type: SchemaTypes.ObjectId, ref: 'Products'}])
    products: Types.ObjectId[];
}

export const SubcategorySchema = SchemaFactory.createForClass(SubcategoryEntity);