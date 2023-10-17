import { Module } from '@nestjs/common';
import { productsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';
import { SubcategorySchema } from 'src/subcategories/entities/subcategory.entity';

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema},
    { name : 'Subcategories', schema: SubcategorySchema}])
  ],
  controllers: [ProductsController],
  providers: [productsService],
})
export class ProductsModule {}
