import {Collection, Entity, ManyToMany, PrimaryKey, Property} from '@mikro-orm/core';
import { Reise } from './reise';
@Entity({tableName: 'reiseziel'})
export class Reiseziel {
    @PrimaryKey()
    rz_id!: number;
    @Property()
    rz_Name!: string;
    @Property()
    rz_Beschreibung!: string;
    @Property()
    rz_Bild!: string;

    @ManyToMany(() => Reise, reise => reise.reiseziels)
    reises = new Collection<Reise>(this);

}