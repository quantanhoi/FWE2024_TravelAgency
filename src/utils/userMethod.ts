import { MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { UserData } from "../entities/user";
import { UserDTO } from "../dto/userDTO";

export async function getUserById(u_id: number): Promise<UserData | null> {
    const orm = await MikroORM.init(defineConfig); // Ensure MikroORM is initialized with the right config
    try {
        const em = orm.em.fork(); // Create a fork of the EntityManager
        const userDataRepo = em.getRepository(UserData); // Get the repository for Reiseziel
        const userdata = await userDataRepo.findOne({ u_id }); // Use await to handle the Promise
        return userdata; // Returns the Reiseziel if found, or null if not found
    } catch (error) {
        console.error('Failed to fetch userData:', error); // Error handling
        throw error; // Re-throw the error for further handling upstream
    } finally {
        await orm.close(); // Ensure the ORM is closed after the operation
    }
}

export async function pushUser(user: UserData): Promise<boolean> {
    const orm = await MikroORM.init(defineConfig)
    try {
        const em = orm.em.fork();
        await em.persist(user).flush();
        return true;
    }
    catch(error) {
        console.error('Failed to push userData:', error); // Error handling
        // return false;
        throw error; // Re-throw the error for further handling upstream
    }
    finally {
        await orm.close();
    }
}

export function toUserDTO(user: UserData|null): UserDTO|null {
    if(user) {
        return new UserDTO(user.u_id, user.u_email, user.u_name);
    }
    else {
        return null;
    }
        
}

export async function getUserDtoById(id: number): Promise<UserDTO|null> {
    return toUserDTO(await getUserById(id));
}

export async function getUserByEmail(email: string): Promise<UserData | null> {
    const orm = await MikroORM.init(defineConfig); // Ensure MikroORM is initialized with the right config
    try {
        const em = orm.em.fork(); // Create a fork of the EntityManager
        const userDataRepo = em.getRepository(UserData); // Get the repository for Reiseziel
        const userdata = await userDataRepo.findOne({ u_email: email }); // Use await to handle the Promise
        return userdata; // Returns the Reiseziel if found, or null if not found
    } catch (error) {
        console.error('Failed to fetch userData:', error); // Error handling
        throw error; // Re-throw the error for further handling upstream
    } finally {
        await orm.close(); // Ensure the ORM is closed after the operation
    }
}
//to get userDTOById, it should be userMethod.toUserDTO(await userMethod.getUserById(id));