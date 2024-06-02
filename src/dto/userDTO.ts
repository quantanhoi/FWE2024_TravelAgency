

export class UserDTO {
    u_id!: number;
    u_email: string;
    u_name: string;
    u_isadmin: boolean;

    constructor(id: number, email: string, name: string, u_isadmin: boolean) {
        this.u_id = id;
        this.u_email = email;
        this.u_name = name;
        this.u_isadmin = u_isadmin;
    }
}