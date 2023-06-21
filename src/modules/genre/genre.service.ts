import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre) private genreRepository: Repository<Genre>
    ) { }
    async findAll() {
        return await this.genreRepository.find();
    }

    async findOne(id: number) {
        return await this.genreRepository.findOne({
            where: { id }
        })
    }

    async save(genres: Genre[]) {
        return await this.genreRepository.save(genres);
    }
}
