import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  profileImage: string;
}
