import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { GenreService } from './genre.service';

import { Genre } from '../../entities';

@Resolver(() => Genre)
export class GenreResolver {
  constructor(private readonly genreService: GenreService) { }


  @Query(() => [Genre], { name: 'genres' })
  async findAll() {
    return await this.genreService.findAll();
  }

  @Query(() => Genre, { name: 'genre' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.genreService.findOne(id);
  }
}
