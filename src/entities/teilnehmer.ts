import {PrimaryKey, Property} from '@mikro-orm/core';
export class Teilnehmer {
    @PrimaryKey()
    t_id!: number;

    @Property()
    t_Name!: string;
}