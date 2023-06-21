import { Test, TestingModule } from '@nestjs/testing';
import { ActorResolver } from './actor.resolver';
import { ActorService } from './actor.service';

describe('ActorResolver', () => {
  let resolver: ActorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActorResolver, ActorService],
    }).compile();

    resolver = module.get<ActorResolver>(ActorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
