import { MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { userData } from "../entities/user";

export async function getUserById(u_id: number): Promise<userData | null> {
    const orm = await MikroORM.init(defineConfig); // Ensure MikroORM is initialized with the right config
    try {
        const em = orm.em.fork(); // Create a fork of the EntityManager
        const userDataRepo = em.getRepository(userData); // Get the repository for Reiseziel
        const userdata = await userDataRepo.findOne({ u_id }); // Use await to handle the Promise
        return userdata; // Returns the Reiseziel if found, or null if not found
    } catch (error) {
        console.error('Failed to fetch userData:', error); // Error handling
        throw error; // Re-throw the error for further handling upstream
    } finally {
        await orm.close(); // Ensure the ORM is closed after the operation
    }
}