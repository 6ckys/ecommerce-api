import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/user/interfaces/user.interface';
import { IAdmin } from './interfaces/admin.interface';

@Injectable()
export class AdminService {
  constructor(@InjectModel("users") private userModel: Model<IAdmin>){}
  async createAdmin(createAdminDto: CreateAdminDto) : Promise<IAdmin> {
    const newAdmin = await new this.userModel(createAdminDto);
    return newAdmin.save();
  }

  async updateAdmin(AdminId: string, UpdateAdminDto: UpdateAdminDto): Promise<IAdmin> {
    const existingAdmin = await this.userModel.findByIdAndUpdate(AdminId, UpdateAdminDto, {new: true});
    if(!existingAdmin){
      throw new NotFoundException(`Admin #${AdminId} not found`);
    }
    return existingAdmin;
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    const AdminData = await this.userModel.find({ role: "Admin" }).select("-__v");
    if(!AdminData || AdminData.length == 0){
      throw new NotFoundException('Admins data not found!');
    }
    return AdminData;
  }

  async getAdmin(AdminId: string): Promise<IAdmin> {
    const existingAdmin = await this.userModel.findById(AdminId).exec();
    if(!existingAdmin){
      throw new NotFoundException(`Admins #${AdminId} not found!`);
    }
    return existingAdmin;
  }

  async deleteAdmin(AdminId: string): Promise<IAdmin> {
    const deleteAdmin = await this.userModel.findByIdAndDelete(AdminId).exec();
    if(!deleteAdmin){
      throw new NotFoundException(`Admins #${AdminId} not found!`);
    }
    return deleteAdmin;
  }
}
