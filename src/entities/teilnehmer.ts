import {Entity, PrimaryKey, Property} from '@mikro-orm/core';

@Entity()
export class Teilnehmer {
    @PrimaryKey()
    t_id!: number;

    @Property()
    t_Name!: string;
}