import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Reiseziel } from './reiseziel';
import { Teilnehmer } from './teilnehmer';

@Entity({tableName: 'reise'})
export class Reise {
    @PrimaryKey()
    r_id!: number;

    @Property()
    r_Name!: string;

    @Property()
    r_Beschreibung!: string;

    @Property()
    r_Bild!: Date;


    @ManyToMany(() => Reiseziel, reiseziel => reiseziel.reises, {
        owner: true,
        pivotTable: 'reise_reiseziel',
        joinColumns: ['r_id'],  // Correct column references
        inverseJoinColumns: ['rz_id']
    })
    reiseziels = new Collection<Reiseziel>(this);


    //reise is the owner of the relationship
    @ManyToMany(() => Teilnehmer, teilnehmer => teilnehmer.reises, {
        owner: true,
        pivotTable: 'teilnehmer_reise',
        joinColumns: ['r_id'],
        inverseJoinColumns: ['t_id']
    })
    teilnehmers = new Collection<Teilnehmer>(this);
}