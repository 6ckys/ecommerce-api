import { Injectable, NotFoundException } from '@nestjs/common';
import { IProduct } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ISubcategory } from 'src/subcategories/interfaces/subcategory.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class productsService {
  constructor(@InjectModel('Products') private ProductModel: Model<IProduct>,
  @InjectModel('Subcategories') private SubCategoryModel: Model<ISubcategory>){}

  async createProduct(createProductDto: CreateProductDto): Promise<IProduct> {
    const newProduct = await new this.ProductModel(createProductDto);
    await this.SubCategoryModel.findByIdAndUpdate(createProductDto.subcategory, {$push: {products: newProduct }});
    return newProduct.save();
  }

  async updateProduct(ProductId: string, updateProductDto: UpdateProductDto): Promise<IProduct> {
    const existingProduct = await this.ProductModel.findByIdAndUpdate(ProductId, updateProductDto, {new: true});
    if(!existingProduct){
      throw new NotFoundException(`Product #${ProductId} not found`);
    }
    return existingProduct;
  }

  async getAllProducts(): Promise<IProduct[]> {
    const ProductData = await this.ProductModel.find().select("-__v");
    if(!ProductData || ProductData.length == 0){
      throw new NotFoundException('Products data not found!');
    }
    return ProductData
  }

  async getProduct(ProductId: string): Promise<IProduct> {
    const existingProduct = await (await this.ProductModel.findById(ProductId)).populate({path:"subcategory",populate:{path: "category"}});
    if(!existingProduct){
      throw new NotFoundException(`Products #${ProductId} not found!`);
    }
    return existingProduct;
  }

  async deleteProduct(ProductId: string): Promise<IProduct> {
    const deleteProduct = await this.ProductModel.findByIdAndDelete(ProductId).exec();
    await this.SubCategoryModel.findByIdAndUpdate(deleteProduct.subcategory, {$pull: {products: deleteProduct._id }});
    if(!deleteProduct){
      throw new NotFoundException(`Products #${ProductId} not found!`);
    }
    return deleteProduct;
  }
}
