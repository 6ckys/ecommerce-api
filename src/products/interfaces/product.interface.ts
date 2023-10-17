import { Document } from "mongoose";
export interface IProduct extends Document{
    readonly ref: string;
    readonly price: number;
    readonly description: string;
    readonly galleries: string[];
    readonly qte: number;
    readonly subcategory: string;
}