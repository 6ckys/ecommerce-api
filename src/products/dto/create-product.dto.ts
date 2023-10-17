import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly ref: string;
    
    @IsNumber()
    @IsNotEmpty()
    readonly price: number;
    
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    galleries: string[];

    @IsNumber()
    @IsNotEmpty()
    readonly qte: number;

    @IsString()
    @IsNotEmpty()
    readonly subcategory: string;
}
