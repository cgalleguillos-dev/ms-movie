import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actor } from '../../entities';
import { Repository } from 'typeorm';

@Injectable()
export class ActorService {
    constructor(
        @InjectRepository(Actor) private actorRepository: Repository<Actor>
    ) { }
    async findAll() {
        return await this.actorRepository.find();
    }

    async findOne(id: number) {
        return await this.actorRepository.findOne({
            where: { id: id }
        })
    }

    async findMany(uniqueActorIds: number[]) {
        return await this.actorRepository.find({
            where: uniqueActorIds.map(id => ({ id: id }))
        })
    }

    async saveMany(actors: Actor[]) {
        return await this.actorRepository.save(actors);
    }

    async saveOne(actor: Actor) {
        return await this.actorRepository.save(actor);
    }
}
