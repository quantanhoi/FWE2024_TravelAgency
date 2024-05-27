import { MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { UserData } from "../entities/user";
import { UserDTO } from "../dto/userDTO";
import { Reise } from "../entities/reise";
import * as reiseMethod from './reiseMethod';

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

export async function getUserDtoByEmail(email: string): Promise<UserDTO|null> {
    return toUserDTO(await getUserByEmail(email));
}

export async function getUserWithReises(email: string): Promise<UserData | null> {
    const orm = await MikroORM.init(defineConfig);
    const em = orm.em.fork();
    try {
        // Fetch the user and populate the reises collection
        //by using populate reises.zeitraum, we can get the zeitraum of reises
        //if it's only "reises", we can only get the reises without zeitraum
        const user = await em.findOne(UserData, { u_email: email }, { populate: ['reises.zeitraum'] });
        return user;
    } catch (error) {
        console.error('Failed to fetch user with reises:', error);
        throw error;
    } finally {
        await orm.close();
    }
}

export async function addReise(user: UserData, reise_id: number): Promise<void>{
    const orm = await MikroORM.init(defineConfig);
    try {
        const em = orm.em.fork();
        const reise = await reiseMethod.getReiseById(reise_id);
        if(!user || !reise) {
            throw new Error('User or Reise not found');
        }
        // Check if the Reise already exists in the user's list
        const userHasReise = user.reises.getItems().some(r => r.r_id === reise_id);
        if (userHasReise) {
            throw new Error('Reise already exists in user list');
        }
        reise.teilnehmers.add(user);
        await em.persistAndFlush(reise);
    }
    catch (error) {
        console.error('Failed to add reise: ', error);
        throw error;
    }
    finally {
        await orm.close();
    }
}
// export async function removeReise(userData: UserData, reise_id: number): Promise<void> {
//     const orm = await MikroORM.init(defineConfig);
//     try {
//         const em = orm.em.fork();
//         const reise = await reiseMethod.getReiseById(reise_id);
//         console.log(reise);
//         if (!userData || !reise) {
//             throw new Error('User or Reise not found');
//         }
//         // Check if the Reise exists in the user's list
//         const userHasReise = userData.reises.getItems().some(r => r.r_id === reise_id);
//         if (!userHasReise) {
//             throw new Error('Reise does not exist in user list');
//         }
//         reise.teilnehmers.remove(userData).where({u_email: userData.u_email});
//         await em.persistAndFlush(reise);
//     } catch (error) {
//         console.error('Failed to remove reise:', error);
//         throw error;
//     } finally {
//         await orm.close();
//     }
// }

export async function removeReise(email: string, reise_id: number): Promise<void> {
    const orm = await MikroORM.init(defineConfig);
    try {
        const em = orm.em.fork();

        // Refetch the user entity to ensure it's managed by the current entity manager
        const user = await em.findOneOrFail(UserData, {u_email: email},  { populate: ['reises'] });

        const reise = await em.findOneOrFail(Reise, {r_id: reise_id}, { populate: ['teilnehmers'] });

        if (!user || !reise) {
            throw new Error('User or Reise not found');
        }

        // Check if the Reise exists in the user's list
        const userHasReise = user.reises.getItems().some(r => r.r_id === reise_id);
        if (!userHasReise) {
            throw new Error('Reise does not exist in user list');
        }

        // Remove the user from the trip's participants
        reise.teilnehmers.remove(user);
        
        // Persist the changes
        await em.flush();
    } catch (error) {
        console.error('Failed to remove reise:', error);
        throw error;
    } finally {
        await orm.close();
    }
}

//to get userDTOById, it should be userMethod.toUserDTO(await userMethod.getUserById(id));