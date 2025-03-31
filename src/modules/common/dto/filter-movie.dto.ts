import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from './pagination.dto';

export class FilterMovieDto extends PaginationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  producer?: string;
}
