import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
type jwtpayload={
sub: string
Username: string
}
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super(
            {    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey:"Itgate"
            }
        );
    }
async validate(payload:jwtpayload){
    return payload;
}

}