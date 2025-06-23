import { IsString, IsOptional } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateFeatureDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
