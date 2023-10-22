import { Controller, Get, Post, Body, Put, Res, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { subcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { response } from 'express';

@Controller('Subcategories')
export class SubcategoriesController {
  constructor(private readonly SubcategoriesService: subcategoriesService) {}

  @Post()
  async createSubcategory(@Res() response, @Body() CreateSubcategoryDto: CreateSubcategoryDto){

    try{
      const newSubcategory = await this.SubcategoriesService.createSubcategory(CreateSubcategoryDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Subcategory has been created successfully',
        status: HttpStatus.CREATED,
        data: newSubcategory
      });
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        message: 'Error: Subcategory not created!' + err,
        data: null
      })
    }
  }

  @Put("/:id")
  async updateSubcategory(@Res() response,@Param('id') SubcategoryId, @Body() updateSubcategoryDto: UpdateSubcategoryDto, @UploadedFile() file: Express.Multer.File){

    try{
      const existingSubcategory = await this.SubcategoriesService.updateSubcategory(SubcategoryId, updateSubcategoryDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Subcategory has been successfully updated',
        data: existingSubcategory,
        status: HttpStatus.OK
      });
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Get()
  async getSubcategorys(@Res() response){

    try{
      const SubcategoryData = await this.SubcategoriesService.getAllSubcategorys();
      return response.status(HttpStatus.OK).json({
        message: 'All Subcategorys data found successfully',
        status: HttpStatus.OK,
        data: SubcategoryData,
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
  async getSubcategory(@Res() response, @Param('id') SubcategoryId: string){
    try{
      const existingSubcategory = await this.SubcategoriesService.getSubcategory(SubcategoryId);
      return response.status(HttpStatus.OK).json({
        message: 'Subcategory found successfully',
        data: existingSubcategory,
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
  async deleteSubcategory(@Res() response, @Param('id') SubcategoryId: string){
    try{
      const deleteSubcategory = await this.SubcategoriesService.deleteSubcategory(SubcategoryId);
      return response.status(HttpStatus.OK).json({
        message: 'Subcategory deleted successfully',
        status: HttpStatus.OK,
        data: deleteSubcategory
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
