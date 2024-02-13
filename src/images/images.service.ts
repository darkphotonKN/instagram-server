import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDTO } from './dtos/create-img.dto';
import { Image } from './entities/image.entity';

@Injectable()
export class ImagesService {
  constructor(
    // repository injection
    @InjectRepository(Image) private imageRepo: Repository<Image>,
  ) {}

  // gets all images from repo
  async getImages(): Promise<Image[]> {
    try {
      // TODO add user specific - filter
      const imageList = this.imageRepo.find();
      return imageList;
    } catch (err) {
      throw new HttpException('Error when retrieving images from DB.', 404);
    }
  }

  // creates an image
  async createImage(imageObj: CreateImageDTO) {
    try {
      const savedImage = await this.imageRepo.save(imageObj);
      return savedImage;
    } catch (err) {
      throw new HttpException(err, 404);
    }
  }
}
