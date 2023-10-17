import { Controller, Get, Post, Body, Put, Res, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/categories",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  async createCategory(@Res() response, @Body() CreateCategoryDto: CreateCategoryDto, @UploadedFile() file: Express.Multer.File){

    try{
      CreateCategoryDto.file = file.filename;
      const newCategory = await this.categoriesService.createCategory(CreateCategoryDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Category has been created successfully',
        status: HttpStatus.CREATED,
        data: newCategory
      });
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        message: 'Error: Category not created!' + err,
        data: null
      })
    }
  }

  @Put("/:id")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./upload/categories",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  async updateCategory(@Res() response,@Param('id') CategoryId, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() file: Express.Multer.File){

    try{
      if(file==undefined||file==null){
        updateCategoryDto.file=(await this.categoriesService.getCategory(CategoryId)).file;
        const existingCategory = await this.categoriesService.updateCategory(CategoryId, updateCategoryDto);
        return response.status(HttpStatus.CREATED).json({
          message: 'Category has been successfully updated',
          data: existingCategory,
          status: HttpStatus.OK
        });
      }else{
        updateCategoryDto.file=file.filename;
        const existingCategory = await this.categoriesService.updateCategory(CategoryId, updateCategoryDto);
        return response.status(HttpStatus.CREATED).json({
          message: 'Category has been successfully updated',
          data: existingCategory,
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
  async getCategorys(@Res() response){

    try{
      const CategoryData = await this.categoriesService.getAllCategorys();
      return response.status(HttpStatus.OK).json({
        message: 'All Categorys data found successfully',
        status: HttpStatus.OK,
        data: CategoryData,
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
  async getCategory(@Res() response, @Param('id') CategoryId: string){
    try{
      const existingCategory = await this.categoriesService.getCategory(CategoryId);
      return response.status(HttpStatus.OK).json({
        message: 'Category found successfully',
        data: existingCategory,
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
  async deleteCategory(@Res() response, @Param('id') CategoryId: string){
    try{
      const deleteCategory = await this.categoriesService.deleteCategory(CategoryId);
      return response.status(HttpStatus.OK).json({
        message: 'Category deleted successfully',
        status: HttpStatus.OK,
        data: deleteCategory
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
