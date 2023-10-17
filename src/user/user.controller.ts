import { Controller, Get, Post, Body, Put, Res, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/user",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  async createUser(@Res() response, @Body() CreateUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File){

    try{
      CreateUserDto.photo = file.filename;
      const newUser = await this.userService.createUser(CreateUserDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        status: HttpStatus.CREATED,
        data: newUser
      });
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        message: 'Error: User not created!' + err,
        data: null
      })
    }
  }

  @Put("/:id")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/user",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  async updateUser(@Res() response,@Param('id') UserId, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File){

    try{
      if(file==undefined||file==null){
        updateUserDto.photo=(await this.userService.getUser(UserId)).photo;
        const existingUser = await this.userService.updateUser(UserId, updateUserDto);
        return response.status(HttpStatus.CREATED).json({
          message: 'User has been successfully updated',
          data: existingUser,
          status: HttpStatus.OK
        });
      }else{
        updateUserDto.photo=file.filename;
        const existingUser = await this.userService.updateUser(UserId, updateUserDto);
        return response.status(HttpStatus.CREATED).json({
          message: 'User has been successfully updated',
          data: existingUser,
          status: HttpStatus.OK
        });
      }
      
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: "erreur: "+err,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Get('/findByUsername')
  async getUserByUsername(@Res() response, @Query('username') Username: string){
    try{
      const existingUser = await this.userService.findByUsername(Username);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        data: existingUser,
        status: HttpStatus.OK
      });
    } catch (err){
      return response.status(err.status).json({
        message: err.response,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Get()
  async getUsers(@Res() response){

    try{
      const UserData = await this.userService.getAllUsers();
      return response.status(HttpStatus.OK).json({
        message: 'All Users data found successfully',
        status: HttpStatus.OK,
        data: UserData,
      });
    } catch (err){
      return response.status(err.status).json({
        message: err.response,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Get('/:id')
  async getUser(@Res() response, @Param('id') UserId: string){
    try{
      const existingUser = await this.userService.getUser(UserId);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        data: existingUser,
        status: HttpStatus.OK
      });
    } catch (err){
      return response.status(err.status).json({
        message: err.response,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() response, @Param('id') UserId: string){
    try{
      const deleteUser = await this.userService.deleteUser(UserId);
      return response.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
        status: HttpStatus.OK,
        data: deleteUser
      });
    } catch (err){
      return response.status(err.status).json({
        message: err.response,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }
}
