import {Entity, OneToOne, PrimaryKey, Property} from '@mikro-orm/core';

@Entity()
export class Zeitraum {
    @PrimaryKey()
    z_id!: number;

    @Property()
    z_startDate!: Date;

    @Property()
    z_endDate!: Date;

    
}