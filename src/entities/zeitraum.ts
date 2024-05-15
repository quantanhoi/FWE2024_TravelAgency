import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
@Entity()
export class Zeitraum {
    @PrimaryKey()
    z_id!: number;

    @Property({fieldName: 'z_startdate'})
    z_startDate!: Date;

    @Property({fieldName: 'z_enddate'})
    z_endDate!: Date;

    constructor(startDate: Date, endDate: Date) {
        this.z_startDate = startDate;
        this.z_endDate = endDate;
    }
}