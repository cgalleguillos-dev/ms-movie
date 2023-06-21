import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreResolver } from './genre.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  providers: [GenreResolver, GenreService],
  exports: [GenreService]
})
export class GenreModule { }
