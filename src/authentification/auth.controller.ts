import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from './common/guards/AccessToken.guard';
import { RefreshTokenGuard } from './common/guards/RefreshToken.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/user",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  signup(@Body() createUserDto: CreateUserDto, @UploadedFile() file:Express.Multer.File) {
    createUserDto.photo=file.filename;
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: CreateLoginDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}