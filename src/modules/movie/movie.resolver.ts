import { ResolveReference, Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { MovieService } from './movie.service';
import { Actor, Genre, Movie } from '../../entities';

@Resolver(() => Movie)
export class MovieResolver {
  constructor(
    private readonly movieService: MovieService,
  ) { }

  @Query(() => [Movie], { name: 'movies' })
  async getMovies() {
    return await this.movieService.findAll();
  }

  @Query(() => Movie, { name: 'getMovieByID' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.movieService.findOne(id);
  }

  @ResolveField('genres', () => [Genre])
  async genres(@Parent() movie: Movie) {
    return await this.movieService.findGenresByMovieId(movie.id);
  }

  @ResolveField('actors', () => [Actor])
  async actors(@Parent() movie: Movie) {
    return await this.movieService.findActorByMovieId(movie.id);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    return this.movieService.findOne(+reference.id);
  }
}
