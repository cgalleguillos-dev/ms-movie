import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ActorService } from './actor.service';
import { Actor } from '../../entities';

@Resolver(() => Actor)
export class ActorResolver {
  constructor(private readonly actorService: ActorService) { }

  @Query(() => [Actor], { name: 'actors' })
  async findAll() {
    return await this.actorService.findAll();
  }

  @Query(() => Actor, { name: 'actor' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.actorService.findOne(id);
  }
}
