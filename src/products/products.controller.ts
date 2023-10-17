import { Controller,UploadedFiles, Get, Post, Body, Put, Res, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { productsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('Products')
export class ProductsController {
  constructor(private readonly productsService: productsService) {}


  @Post()
  @UseInterceptors(
    FilesInterceptor("files",10, {
      storage: diskStorage({
        destination: "./upload/products",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  async createProduct(@Res() response, @Body() CreateProductDto: CreateProductDto, @UploadedFiles() files){

    try{
      CreateProductDto.galleries= files.map(item=>item.filename);
      const newProduct = await this.productsService.createProduct(CreateProductDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Product has been created successfully',
        status: HttpStatus.CREATED,
        data: newProduct
      });
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        status: 400,
        message: 'Error: Product not created!' + err,
        data: null
      })
    }
  }

  @Put("/:id")
  @UseInterceptors(
    FilesInterceptor("files",10, {
      storage: diskStorage({
        destination: "./upload/products",
        filename: (_request, file, callback) =>
        callback(null, `${new Date().getTime()}-${file.originalname}`),
      })
    })
  )
  async updateProduct(@Res() response,@Param('id') ProductId, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() files){

    try{
      if(files==undefined||files.length==0){
        updateProductDto.galleries= (await this.productsService.getProduct(ProductId)).galleries;
        const existingProduct = await this.productsService.updateProduct(ProductId, updateProductDto);
        return response.status(HttpStatus.CREATED).json({
          message: 'Product has been successfully updated',
          data: existingProduct,
          status: HttpStatus.OK
        });
      }else{
        updateProductDto.galleries= files.map(item=>item.filename);
        const existingProduct = await this.productsService.updateProduct(ProductId, updateProductDto);
        return response.status(HttpStatus.CREATED).json({
          message: 'Product has been successfully updated',
          data: existingProduct,
          status: HttpStatus.OK
        });
      }
    } catch (err){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
        status: HttpStatus.BAD_REQUEST,
        data: null
      })
    }
  }

  @Get()
  async getProducts(@Res() response){

    try{
      const ProductData = await this.productsService.getAllProducts();
      return response.status(HttpStatus.OK).json({
        message: 'All Products data found successfully',
        status: HttpStatus.OK,
        data: ProductData,
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
  async getProduct(@Res() response, @Param('id') ProductId: string){
    try{
      const existingProduct = await this.productsService.getProduct(ProductId);
      return response.status(HttpStatus.OK).json({
        message: 'Product found successfully',
        data: existingProduct,
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
  async deleteProduct(@Res() response, @Param('id') ProductId: string){
    try{
      const deleteProduct = await this.productsService.deleteProduct(ProductId);
      return response.status(HttpStatus.OK).json({
        message: 'Product deleted successfully',
        status: HttpStatus.OK,
        data: deleteProduct
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
