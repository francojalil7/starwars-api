import { ApiProperty } from '@nestjs/swagger';

import { Movie } from '../entities/movie.entity';

export class MoviesResponseDto {
  @ApiProperty({ type: [Movie], description: 'List of movies' })
  results: Movie[];

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 50, description: 'Total number of movies available' })
  count: number;

  @ApiProperty({ example: 10, description: 'Limit of movies per page' })
  limit: number;
}
