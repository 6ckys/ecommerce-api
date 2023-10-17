import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel("users") private userModel: Model<IUser>){}
  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser = await new this.userModel(createUserDto);
    return newUser.save();
  }

  async updateUser(UserId: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const existingUser = await this.userModel.findByIdAndUpdate(UserId, updateUserDto, {new: true});
    if(!existingUser){
      throw new NotFoundException(`User #${UserId} not found`);
    }
    return existingUser;
  }

  async getAllUsers(): Promise<IUser[]> {
    const UserData = await this.userModel.find().select("-__v");
    if(!UserData || UserData.length == 0){
      throw new NotFoundException('Users data not found!');
    }
    return UserData
  }

  async getUser(UserId: string): Promise<IUser> {
    const existingUser = await this.userModel.findById(UserId).exec();
    if(!existingUser){
      throw new NotFoundException(`Users #${UserId} not found!`);
    }
    return existingUser;
  }

  async deleteUser(UserId: string): Promise<IUser> {
    const deleteUser = await this.userModel.findByIdAndDelete(UserId).exec();
    if(!deleteUser){
      throw new NotFoundException(`Users #${UserId} not found!`);
    }
    return deleteUser;
  }

  async findByUsername(username: string): Promise<IUser> {
    const User = await this.userModel.findOne({ username }).exec();
    
    return User;
  }
}