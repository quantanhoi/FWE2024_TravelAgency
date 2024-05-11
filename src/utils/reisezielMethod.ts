import { LoadStrategy, MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { Reiseziel} from "../entities/reiseziel";


/**
 * function to fetch all reiseziel from the database
 * @returns array list of reiseziel in the database (no limit) 
 * @tested
 */
export async function getAllReiseziel(): Promise<Reiseziel[]> {
    const orm = await MikroORM.init(defineConfig);
    try{
        const em = orm.em.fork();
        const reisezielRepo = em.getRepository(Reiseziel);
        const allReiseziel = reisezielRepo.findAll();
        return allReiseziel;
        
    }
    finally{
        await orm.close();
    }
    
}


/**
 * Function to get a single reiseziel by id from the database
 * @param rz_id id of reiseziel
 * @returns reiseziel by that id
 * @tested
 */
export async function getReisezielById(rz_id: number): Promise<Reiseziel | null> {
    const orm = await MikroORM.init(defineConfig); // Ensure MikroORM is initialized with the right config
    try {
        const em = orm.em.fork(); // Create a fork of the EntityManager
        const reisezielRepo = em.getRepository(Reiseziel); // Get the repository for Reiseziel
        const reiseziel = await reisezielRepo.findOne({ rz_id }); // Use await to handle the Promise
        return reiseziel; // Returns the Reiseziel if found, or null if not found
    } catch (error) {
        console.error('Failed to fetch Reiseziel:', error); // Error handling
        throw error; // Re-throw the error for further handling upstream
    } finally {
        await orm.close(); // Ensure the ORM is closed after the operation
    }
}

//TODO: add function to add extra reiseziel to database