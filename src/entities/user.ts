import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';

@Entity({tableName: 'userdata'})
export class UserData {

    @PrimaryKey()
    u_id!: number;

    @Property()
    u_email: string;
    @Property()
    u_name: string;
    @Property()
    u_password: string;


    constructor(email: string, name: string, password: string) {
        this.u_email = email;
        this.u_name = name;
        this.u_password =  password;
    }
}