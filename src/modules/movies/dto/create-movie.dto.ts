import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsArray, IsOptional } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  openingCrawl: string;

  @ApiProperty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsString()
  producer: string;

  @ApiProperty()
  @IsDateString()
  releaseDate: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  characters?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  planets?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  starships?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  vehicles?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  species?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;
}
