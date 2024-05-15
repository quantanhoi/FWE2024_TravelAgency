import {Collection, Entity, ManyToMany, PrimaryKey, Property, OneToOne} from '@mikro-orm/core';
import { Reise } from './reise';
import { Zeitraum } from './zeitraum';
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
    @OneToOne(() => Zeitraum, { joinColumn: 'z_id'})
    zeitraum?: Zeitraum;

    @ManyToMany(() => Reise, reise => reise.reiseziels)
    reises = new Collection<Reise>(this);

}