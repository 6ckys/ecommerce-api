import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { AdminSchema } from 'src/admin/entities/admin.entity';

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema, 
    discriminators: [{name: "Admin", schema: AdminSchema}]}])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
