import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
