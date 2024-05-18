

export class UserDTO {
    u_id!: number;
    u_email: string;
    u_name: string;

    constructor(id: number, email: string, name: string) {
        this.u_id = id;
        this.u_email = email;
        this.u_name = name;
    }
}