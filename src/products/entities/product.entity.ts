import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import{ Document, SchemaTypes, Types} from "mongoose";

@Schema({timestamps: true})
export class ProductEntity extends Document{

    @Prop({required: true, unique: true})
    ref: string;

    @Prop({required: true})
    price: number;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    galleries: string[];

    @Prop({required: true})
    qte: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Subcategories', required: true})
    subcategory!: Types.ObjectId;
    
}

export const ProductSchema = SchemaFactory.createForClass(ProductEntity);