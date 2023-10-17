import { Module } from '@nestjs/common';
import { subcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcategorySchema } from './entities/subcategory.entity';
import { CategorySchema } from 'src/categories/entities/category.entity';

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: 'Subcategories', schema: SubcategorySchema},
    { name : 'categories', schema: CategorySchema}])
  ],
  controllers: [SubcategoriesController],
  providers: [subcategoriesService],
})
export class SubcategoriesModule {}
