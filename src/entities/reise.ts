import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Reiseziel } from './reiseziel';

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

    // @ManyToMany( {
    //     owner: true,
    //     pivotTable: 'reise_reiseziel' //name of pivot table
    // })
    // reiseziels = new Collection<Reiseziel>(this);

    @ManyToMany(() => Reiseziel, reiseziel => reiseziel.reises, {
        owner: true,
        pivotTable: 'reise_reiseziel',
        joinColumns: ['r_id'],  // Correct column references
        inverseJoinColumns: ['rz_id']
    })
    reiseziels = new Collection<Reiseziel>(this);
}