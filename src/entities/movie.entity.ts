import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Actor } from './actor.entity';
import { Genre } from './genre.entity';

@Entity()
@ObjectType()
export class Movie {
    @Field()
    @Column(
        {
            primary: true
        }
    )
    id: number;

    @Field()
    @Column()
    adult: boolean;

    @Field({
        nullable: true
    })
    @Column(
        {
            nullable: true
        }
    )
    backdrop_path: string;

    @Field(
        type => [Genre],
    )
    @JoinTable()
    @ManyToMany(() => Genre)
    genres: Genre[];

    @Field()
    @Column()
    original_language: string;

    @Field()
    @Column()
    original_title: string;

    @Field()
    @Column()
    overview: string;

    @Field(
        type => Float,
    )
    @Column(
        { type: 'float' }
    )
    popularity: number;

    @Field({
        nullable: true
    })
    @Column({
        nullable: true
    })
    poster_path: string;

    @Field({
        nullable: true
    })
    @Column({
        nullable: true
    })
    release_date: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    video: boolean;

    @Field(
        type => Float,
    )
    @Column(
        { type: 'float' }
    )
    vote_average: number;

    @Field(
        type => Int,
    )
    @Column(
        { type: 'int' }
    )
    vote_count: number;

    @Field(
        type => [Actor],
    )
    @ManyToMany(() => Actor, { cascade: true })
    @JoinTable()
    actors: Actor[];
}