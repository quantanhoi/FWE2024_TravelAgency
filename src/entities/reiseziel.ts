import {PrimaryKey, Property} from '@mikro-orm/core';

export class Reiseziel {
    @PrimaryKey()
    rz_id!: number;
    @Property()
    rz_Name!: string;
    @Property()
    rz_Beschreibung!: string;
    @Property()
    rz_Bild!: string;
}