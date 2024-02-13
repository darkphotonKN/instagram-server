import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
