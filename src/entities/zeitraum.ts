import {PrimaryKey, Property} from '@mikro-orm/core';
export class Zeitraum {
    @PrimaryKey()
    z_id!: number;

    @Property()
    z_startDate!: Date;

    @Property()
    z_endDate!: Date;
}