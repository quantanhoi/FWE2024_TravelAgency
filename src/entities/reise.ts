import {PrimaryKey, Property} from '@mikro-orm/core';

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