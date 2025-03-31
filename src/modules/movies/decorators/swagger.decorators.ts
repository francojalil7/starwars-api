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

export function ApiCreateMovie() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Movie created successfully',
      type: Movie,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',

      schema: {
        example: {
          statusCode: 400,
          message: [
            'property episodeId should not exist',
            'releaseDate must be a valid ISO 8601 date string',
          ],
          error: 'Bad Request',
        },
      },
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
      description: 'Forbidden - Only admins can create movies',
      schema: {
        example: {
          statusCode: 403,
          message: 'You need this roles: ADMIN',
          error: 'Forbidden',
        },
      },
    }),
  );
}

export function ApiDeleteMovie() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete movie by ID',
      description:
        'Deletes movie from the database using its ID. Only accessible by admins.',
    }),
    ApiResponse({
      status: 200,
      description: 'Movie deleted successfully',
      schema: {
        example: {
          statusCode: 200,
          message: 'Movie with ID 5 deleted successfully.',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description:
        'Unauthorized authentication credentials are missing or invalid.',
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
      description: 'Forbidden - Only admins can delete movies',
      schema: {
        example: {
          statusCode: 403,
          message: 'You need this roles: ADMIN',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Movie not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Movie with ID 999 not found.',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiUpdateMovie() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a movie',
      description:
        'Update an existing movie by ID. Only admins can perform this action.',
    }),
    ApiResponse({
      status: 200,
      description: 'Movie updated successfully',
      schema: {
        example: {
          statusCode: 200,
          message: 'Movie updated successfully',
          movie: {
            id: 1,
            title: 'Updated Title',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - No valid token',
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
      description: 'Forbidden - Only admins can update movies',
      schema: {
        example: {
          statusCode: 403,
          message: 'You need this roles: ADMIN',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Movie not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Movie with ID 999 not found.',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiSyncMovies() {
  return applyDecorators(
    ApiOperation({
      summary: 'Synchronize movies from SWAPI',
      description:
        'Only for admins. Triggers a manual sync from the Star Wars API.',
    }),
    ApiResponse({
      status: 200,
      description: 'Movies synced successfully',
      schema: {
        example: {
          message: 'Movies synced from SWAPI',
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Only admins can trigger sync',
      schema: {
        example: {
          statusCode: 403,
          message: 'You need this roles: ADMIN',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal server error - Failed to fetch or store data from SWAPI',
      schema: {
        example: {
          statusCode: 500,
          message: 'Failed to sync movies from SWAPI',
          error: 'Internal Server Error',
        },
      },
    }),
  );
}
