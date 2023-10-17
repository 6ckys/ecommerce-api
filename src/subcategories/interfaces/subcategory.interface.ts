import { Document } from "mongoose";
export interface ISubcategory extends Document{
    readonly name: string;
    readonly description: string;
    readonly category: string;
}