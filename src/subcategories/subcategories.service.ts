import { Injectable, NotFoundException } from '@nestjs/common';
import { ISubcategory } from './interfaces/subcategory.interface';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ICategory } from 'src/categories/interfaces/category.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class subcategoriesService {
  constructor(@InjectModel('Subcategories') private SubcategoryModel: Model<ISubcategory>,
  @InjectModel('categories') private CategoryModel: Model<ICategory>){}

  async createSubcategory(createSubcategoryDto: CreateSubcategoryDto): Promise<ISubcategory> {
    const newSubcategory = await new this.SubcategoryModel(createSubcategoryDto);
    await this.CategoryModel.findByIdAndUpdate(createSubcategoryDto.category, {$push: {subcategories: newSubcategory }});
    return newSubcategory.save();
  }

  async updateSubcategory(SubcategoryId: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<ISubcategory> {
    const existingSubcategory = await this.SubcategoryModel.findByIdAndUpdate(SubcategoryId, updateSubcategoryDto, {new: true});
    if(!existingSubcategory){
      throw new NotFoundException(`Subcategory #${SubcategoryId} not found`);
    }
    return existingSubcategory;
  }

  async getAllSubcategorys(): Promise<ISubcategory[]> {
    const SubcategoryData = await this.SubcategoryModel.find().populate("products").populate("category").select("-__v");
    if(!SubcategoryData || SubcategoryData.length == 0){
      throw new NotFoundException('Subcategorys data not found!');
    }
    return SubcategoryData
  }

  async getSubcategory(SubcategoryId: string): Promise<ISubcategory> {
    const existingSubcategory = await this.SubcategoryModel.findById(SubcategoryId).populate("category");
    if(!existingSubcategory){
      throw new NotFoundException(`Subcategorys #${SubcategoryId} not found!`);
    }
    return existingSubcategory;
  }

  async deleteSubcategory(SubcategoryId: string): Promise<ISubcategory> {
    const deleteSubcategory = await this.SubcategoryModel.findByIdAndDelete(SubcategoryId).exec();
    await this.CategoryModel.findByIdAndUpdate(deleteSubcategory.category, {$pull: {subcategories: deleteSubcategory._id }});
    if(!deleteSubcategory){
      throw new NotFoundException(`Subcategorys #${SubcategoryId} not found!`);
    }
    return deleteSubcategory;
  }
}
