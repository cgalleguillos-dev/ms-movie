import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { ActorModule } from './modules/actor/actor.module';
import { GenreModule } from './modules/genre/genre.module';
import { MovieModule } from './modules/movie/movie.module';
import { DataSourceConfig } from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      // load: [baseConfig]
    }),
    TypeOrmModule.forRoot({
      ...DataSourceConfig
    }),
    DatabaseModule, ActorModule, GenreModule, MovieModule],
})
export class AppModule { }
