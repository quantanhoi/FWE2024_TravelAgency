import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
@Entity()
export class Reise {
    @PrimaryKey()
    r_id!: number;

    @Property()
    r_Name!: string;

    @Property()
    r_Beschreibung!: string;

    @Property()
    r_Bild!: Date;

}