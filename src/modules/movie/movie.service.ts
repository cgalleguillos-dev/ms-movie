import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {

    constructor(
        @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    ) { }

    async findAll() {
        return await this.movieRepository.find({
            relations: ['genres']
        });
    }

    async findOne(id: number) {
        return await this.movieRepository.findOne({
            where: { id }, relations: ['genres', 'actors']
        })
    }

    async findMoviesByMoviesIds(moviesIds: number[]) {
        return await this.movieRepository.find({ where: moviesIds.map(id => ({ id })) });
    }

    async findGenresByMovieId(movieId: number) {
        const movieWithGenres = await this.movieRepository
            .createQueryBuilder('movie')
            .leftJoinAndSelect('movie.genres', 'genre')
            .where('movie.id = :id', { id: movieId })
            .getOne();
        return movieWithGenres.genres;
    }

    async findActorByMovieId(movieId: number) {
        const movieWithActors = await this.movieRepository
            .createQueryBuilder('movie')
            .leftJoinAndSelect('movie.actors', 'actor')
            .where('movie.id = :id', { id: movieId })
            .getOne();

        this.fixActorProfilePath(movieWithActors);

        this.sortByActorsOrder(movieWithActors);

        return movieWithActors.actors;
    }

    private fixActorProfilePath(movieWithActors: Movie) {
        movieWithActors.actors = movieWithActors.actors.map(actor => {
            if (actor.profile_path === null) {
                actor.profile_path = "";
            }
            return actor;
        });
    }

    private sortByActorsOrder(movieWithActors: Movie) {
        movieWithActors.actors.sort((a, b) => {
            return a.order - b.order;
        });
    }

    async save(movies: Movie[]) {
        return await this.movieRepository.save(movies);
    }

    async saveOne(movie: Movie) {
        return await this.movieRepository.save(movie);
    }
}
