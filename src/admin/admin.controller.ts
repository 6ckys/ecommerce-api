import { Controller, Get, Post, Body, Put, Res, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/admin",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  async createAdmin(@Res() response, @Body() CreateAdminDto: CreateAdminDto, @UploadedFile() file: Express.Multer.File){

    try{
      CreateAdminDto.photo = file.filename;
      const newAdmin = await this.adminService.createAdmin(CreateAdminDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Admin has been created successfully',
        status: HttpStatus.CREATED,
        data: newAdmin
      });
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        message: 'Error: Admin not created!' + err,
        data: null
      })
    }
  }

  @Put("/:id")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/admin",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  async updateAdmin(@Res() response,@Param('id') AdminId, @Body() updateAdminDto: UpdateAdminDto, @UploadedFile() file: Express.Multer.File){

    try{
      if(file==undefined||file==null){
        updateAdminDto.photo=(await this.adminService.getAdmin(AdminId)).photo;
        const existingAdmin = await this.adminService.updateAdmin(AdminId, updateAdminDto);
        return response.status(HttpStatus.CREATED).json({
          message: 'Admin has been successfully updated',
          data: existingAdmin,
          status: HttpStatus.OK
        });
      }else{
        updateAdminDto.photo=file.filename;
        const existingAdmin = await this.adminService.updateAdmin(AdminId, updateAdminDto);
        return response.status(HttpStatus.CREATED).json({
          message: 'Admin has been successfully updated',
          data: existingAdmin,
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

  @Get()
  async getAdmins(@Res() response){

    try{
      const AdminData = await this.adminService.getAllAdmins();
      return response.status(HttpStatus.OK).json({
        message: 'All Admins data found successfully',
        status: HttpStatus.OK,
        data: AdminData,
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
  async getAdmin(@Res() response, @Param('id') AdminId: string){
    try{
      const existingAdmin = await this.adminService.getAdmin(AdminId);
      return response.status(HttpStatus.OK).json({
        message: 'Admin found successfully',
        data: existingAdmin,
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
  async deleteAdmin(@Res() response, @Param('id') AdminId: string){
    try{
      const deleteAdmin = await this.adminService.deleteAdmin(AdminId);
      return response.status(HttpStatus.OK).json({
        message: 'Admin deleted successfully',
        status: HttpStatus.OK,
        data: deleteAdmin
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
