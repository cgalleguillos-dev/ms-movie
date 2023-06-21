import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, Column } from "typeorm";

@Entity()
@ObjectType()
export class Genre {
    @Field()
    @Column(
        {
            primary: true
        }
    )
    id: number;

    @Field()
    @Column()
    name: string;
}