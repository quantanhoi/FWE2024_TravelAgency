import {Entity, PrimaryKey, Property, ManyToMany, Collection} from '@mikro-orm/core';
import { Reise } from './reise';
@Entity()
export class Teilnehmer {
    @PrimaryKey()
    t_id!: number;

    @Property()
    t_Name!: string;

    @ManyToMany(() => Reise, reise => reise.teilnehmers)
    reises = new Collection<Reise>(this);


    constructor(name: string) {
        this.t_Name = name;
    }
}