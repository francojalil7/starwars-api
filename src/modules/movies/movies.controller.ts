import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MoviesService } from './movies.service';
import {
  ApiCreateMovie,
  ApiDeleteMovie,
  ApiGetMovieById,
  ApiGetMovies,
  ApiSyncMovies,
  ApiUpdateMovie,
} from './decorators';
import { FilterMovieDto } from '../common/dto';
import { Auth } from '../auth/decorators';
import { UserRole } from '../user/entities/user.entity';
import { CreateMovieDto, UpdateMovieDto } from './dto';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiGetMovies()
  async getMovies(@Query() paginationDto: FilterMovieDto) {
    const movies = await this.moviesService.findAll(paginationDto);
    return movies;
  }

  @Get(':id')
  @ApiGetMovieById()
  @Auth(UserRole.USER)
  getMovieById(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getMovieById(id);
  }

  @Post()
  @ApiCreateMovie()
  @Auth(UserRole.ADMIN)
  async create(@Body() dto: CreateMovieDto) {
    return this.moviesService.createMovie(dto);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateMovie()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMovieDto,
  ) {
    const updated = await this.moviesService.updateMovie(id, dto);
    return {
      statusCode: 200,
      message: 'Movie updated successfully',
      movie: updated,
    };
  }

  @Delete(':id')
  @ApiDeleteMovie()
  @Auth(UserRole.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.moviesService.deleteMovie(id);
    return {
      statusCode: 200,
      message: `Movie with ID ${id} deleted successfully.`,
    };
  }

  @Post('sync')
  @Auth(UserRole.ADMIN)
  @ApiSyncMovies()
  async sync() {
    const result = await this.moviesService.syncFromSwapi();
    return { message: result };
  }
}
