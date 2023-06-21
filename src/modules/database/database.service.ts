import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Actor, Genre, Movie } from '../../entities';
import { MovieService } from '../movie/movie.service';
import { GenreService } from '../genre/genre.service';
import { ActorService } from '../actor/actor.service';


@Injectable()
export class DatabaseService {
    apiKey: string = process.env.API_KEY;
    limitPage: number;
    options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${this.apiKey}`
        }
    };

    url: string = 'https://api.themoviedb.org/3';
    movies: Movie[] = [];
    genres: Genre[] = [];
    actors: Actor[] = [];

    constructor(
        private movieService: MovieService,
        private genreService: GenreService,
        private actorService: ActorService,
    ) { }
    async updateDatabase() {
        await this.setLimitPage();
        console.log(`Total pages: ${this.limitPage}`);
        const existingGenres: Genre[] = await this.genreService.findAll();
        const existingMovies: Movie[] = await this.movieService.findAll();
        await this.getGenres();
        await this.genreService.save(this.genres);
        this.genres = await this.genreService.findAll();
        await this.getMovies();
        this.actors = await this.actorService.findAll();
        this.movies = await this.movieService.findAll();

        return {

            old: {
                movies: existingMovies.length,
                genres: existingGenres.length
            },
            new: {
                movies: this.movies.length,
                genres: this.genres.length
            }
        }

    }

    private async getMovies(): Promise<void> {
        for (let page = 1; page <= this.limitPage; page++) {
            await this.getMoviesByPage(page);
        }
    }

    private async getMoviesByPage(page: number): Promise<void> {
        const response = await axios.get(`
      ${this.url}/movie/popular?language=en-US&page=${page}`, this.options);
        const movies = response.data.results;

        await Promise.all(
            movies.map(async (movie) => {
                const existingMovie = await this.movieService.findOne(movie.id);
                if (!existingMovie) {
                    const newMovie: Movie = this.createMovie(movie);
                    const actors = await this.getCreditByMovieId(movie.id);
                    newMovie.genres = await this.getGenreByIDs(movie.genre_ids);
                    await this.saveMovieWithActors(newMovie, actors);
                }
            })
        );
    }

    private async setLimitPage(): Promise<void> {
        const response = await axios.get(`
      ${this.url}/movie/popular?language=en-US`, this.options);
        this.limitPage = parseInt(process.env.LIMIT_PAGES, 10) || response.data.total_pages;
    }

    private async saveMovieWithActors(movie: Movie, actors: Actor[]): Promise<void> {
        const uniqueActors = actors.filter((actor, index, self) =>
            index === self.findIndex((t) => (
                t.id === actor.id
            ))
        );

        const auxActors = await Promise.all(
            uniqueActors.map(async actor => {
                const existingActor = await this.actorService.findOne(actor.id);
                if (!existingActor) {
                    return await this.actorService.saveOne(actor);
                }
                return existingActor;
            })
        );

        movie.actors = auxActors;
        await this.movieService.saveOne(movie);
    }

    private createMovie(movie: any): Movie {
        const newMovie = new Movie();
        newMovie.id = movie.id;
        newMovie.adult = movie.adult;
        newMovie.backdrop_path = movie.backdrop_path;
        newMovie.genres = movie.genres;
        newMovie.original_language = movie.original_language;
        newMovie.original_title = movie.original_title;
        newMovie.overview = movie.overview;
        newMovie.popularity = movie.popularity;
        newMovie.poster_path = movie.poster_path;
        newMovie.release_date = movie.release_date;
        newMovie.title = movie.title;
        newMovie.video = movie.video;
        newMovie.vote_average = movie.vote_average;
        newMovie.vote_count = movie.vote_count;
        return newMovie;
    }

    private async getGenreByIDs(genreIds: number[]): Promise<Genre[]> {
        return this.genres.filter(genre => genreIds.includes(genre.id));
    }

    private async getCreditByMovieId(movieId: number): Promise<Actor[]> {
        const response = await axios.get(`
      ${this.url}/movie/${movieId}/credits?language=en-US`, this.options);
        return response.data.cast;
    }

    private async getGenres(): Promise<void> {
        const response = await axios.get(`
      ${this.url}/genre/movie/list?language=en-US`, this.options);
        this.genres.push(...response.data.genres);
    }
}
