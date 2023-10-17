import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string;
    
    @IsString()
    @IsNotEmpty()
    readonly email: string; 

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    phone: string; 

    @IsString()
    @IsNotEmpty()
    photo: string;

    @IsString()
    RefreshToken:string;
}
