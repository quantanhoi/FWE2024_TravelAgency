import { MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { UserData } from "../entities/user";

export async function getUserById(u_id: number): Promise<UserData | null> {
    const orm = await MikroORM.init(defineConfig); // Ensure MikroORM is initialized with the right config
    try {
        const em = orm.em.fork(); // Create a fork of the EntityManager
        const userDataRepo = em.getRepository(UserData); // Get the repository for Reiseziel
        const userdata = await userDataRepo.findOne({ u_id }); // Use await to handle the Promise
        return userdata; // Returns the Reiseziel if found, or null if not found
    } catch (error) {
        console.error('Failed to fetch userData:', error); // Error handling
        // return null;
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