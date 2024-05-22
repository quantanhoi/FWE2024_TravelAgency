import { Entity, PrimaryKey, Property, ManyToMany, Collection, OneToOne } from '@mikro-orm/core';
import { Reiseziel } from './reiseziel';
import { Teilnehmer } from './teilnehmer';
import { Zeitraum } from './zeitraum';
import { UserData } from './user';

@Entity({tableName: 'reise'})
export class Reise {
    @PrimaryKey()
    r_id!: number;

    @Property()
    r_name!: string;

    @Property()
    r_beschreibung!: string;

    @Property()
    r_bild!: string;

    @OneToOne(() => Zeitraum, {joinColumn: 'z_id'})
    zeitraum!: Zeitraum;


    @ManyToMany(() => Reiseziel, reiseziel => reiseziel.reises, {
        owner: true,
        pivotTable: 'reise_reiseziel',
        joinColumns: ['r_id'],  // Correct column references
        inverseJoinColumns: ['rz_id']
    })
    reiseziels = new Collection<Reiseziel>(this);


    //reise is the owner of the relationship
    //change this to UserData for authentication function
    @ManyToMany(() => UserData, user => user.reises, {
        owner: true,
        pivotTable: 'teilnehmer_reise',
        joinColumns: ['r_id'],
        inverseJoinColumns: ['u_id']
    })
    teilnehmers = new Collection<Teilnehmer>(this);


    constructor(r_name: string, r_beschreibung: string, r_bild: string, zeitraum: Zeitraum) {
        this.r_name = r_name;
        this.r_beschreibung = r_beschreibung;
        this.r_bild =  r_bild;
        this.zeitraum = zeitraum;
    }
}