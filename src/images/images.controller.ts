import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDTO } from './dtos/create-img.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('image')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  // Get list of images
  @UseGuards(AuthGuard)
  @Get('/list')
  getImage() {
    return this.imagesService.getImages();
  }

  // Save Image to DB
  @UseGuards(AuthGuard)
  @Post('/create')
  createImage(@Body() body: CreateImageDTO) {
    return this.imagesService.createImage(body);
  }
}
