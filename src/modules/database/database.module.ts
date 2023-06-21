import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { MovieModule } from '../movie/movie.module';
import { ActorModule } from '../actor/actor.module';
import { GenreModule } from '../genre/genre.module';
@Module({
  imports: [MovieModule, GenreModule, ActorModule],
  controllers: [DatabaseController],
  providers: [DatabaseService]
})
export class DatabaseModule { }
