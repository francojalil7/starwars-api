import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { MoviesResponseDto } from '../dto/movies-response.dto';
import { Movie } from '../entities/movie.entity';

export function ApiGetMovies() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve movies with filters',
      description:
        'Get a paginated and filtered list of movies from the database.',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of movies to return',
      example: 10,
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Number of movies to skip',
      example: 0,
    }),
    ApiQuery({
      name: 'title',
      required: false,
      type: String,
      description: 'Filter movies by title',
    }),
    ApiQuery({
      name: 'director',
      required: false,
      type: String,
      description: 'Filter movies by director',
    }),
    ApiQuery({
      name: 'producer',
      required: false,
      type: String,
      description: 'Filter movies by producer',
    }),
    ApiResponse({
      status: 200,
      description: 'Movies retrieved successfully',
      type: [MoviesResponseDto],
    }),
  );
}

export function ApiGetMovieById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Return movie by Id',
      description: 'Get movie by Id from the database.',
    }),

    ApiResponse({
      status: 200,
      description: 'Movie retrieved successfully',
      type: Movie,
    }),
    ApiResponse({
      status: 401,
      description:
        'Unauthorized - Authentication credentials are missing or invalid.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden - The authenticated user does not have the required role to access this resource.',
      schema: {
        example: {
          statusCode: 403,
          message: 'You need one of these roles: USER',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - when there is no movie with that id',
      schema: {
        example: {
          statusCode: 404,
          message: 'Movie with ID 10101 not found.',
          error: 'Not Found',
        },
      },
    }),
  );
}
