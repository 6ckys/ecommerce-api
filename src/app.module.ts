import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AuthentificationModule } from './authentification/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost:27017", {dbName:"MongoDB"}), CategoriesModule, SubcategoriesModule, ProductsModule, UserModule, AdminModule, AuthentificationModule, ConfigModule.forRoot({isGlobal: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
