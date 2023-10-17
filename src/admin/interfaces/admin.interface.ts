import { IUser } from "src/user/interfaces/user.interface";
export interface IAdmin extends IUser{
    readonly role: string;
    readonly adresse: string;
}