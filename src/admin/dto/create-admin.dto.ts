import { CreateUserDto } from "src/user/dto/create-user.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto extends CreateUserDto{
    @IsString()
    @IsNotEmpty()
    role: string; 

    @IsString()
    @IsNotEmpty()
    adresse: string;
}
