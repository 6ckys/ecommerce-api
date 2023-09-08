import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './interfaces/category.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel('categories') private CategoryModel: Model<ICategory>){}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    const newCategory = await new this.CategoryModel(createCategoryDto);
    return newCategory.save();
  }

  async updateCategory(CategoryId: string, updateCategoryDto: UpdateCategoryDto): Promise<ICategory> {
    const existingCategory = await this.CategoryModel.findByIdAndUpdate(CategoryId, updateCategoryDto);
    if(!existingCategory){
      throw new NotFoundException(`Category #${CategoryId} not found`);
    }
    return existingCategory;
  }

  async getAllCategorys(): Promise<ICategory[]> {
    const CategoryData = await this.CategoryModel.find().select("-__v");
    if(!CategoryData || CategoryData.length == 0){
      throw new NotFoundException('Categorys data not found!');
    }
    return CategoryData
  }

  async getCategory(CategoryId: string): Promise<ICategory> {
    const existingCategory = await this.CategoryModel.findById(CategoryId).exec();
    if(!existingCategory){
      throw new NotFoundException(`Categorys #${CategoryId} not found!`);
    }
    return existingCategory;
  }

  async deleteCategory(CategoryId: string): Promise<ICategory> {
    const deleteCategory = await this.CategoryModel.findByIdAndDelete(CategoryId).exec();
    if(!deleteCategory){
      throw new NotFoundException(`Categorys #${CategoryId} not found!`);
    }
    return deleteCategory;
  }
}
