import { LoadStrategy, MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { Reise } from "../entities/reise";
import { Reiseziel } from "../entities/reiseziel";



export async function getAllReise(): Promise<Reise[]> {
    const orm = await MikroORM.init(defineConfig);
    try{
        const em = orm.em.fork();
        const reise = await em.find(Reise, {}, {
            populate: ['reiseziels'],  // Explicitly populate reiseziels
            //IF NOT POPULATED, IT WILL NOT BE FETCHED
            strategy: LoadStrategy.JOINED  // Using JOIN strategy to fetch related entities
        });
        return reise;
    }
    catch(error){
        console.error('Failed to fetch Reise:', error);
        throw error;
    }
    finally{
        await orm.close();
    }
    
}


export async function printAllReise(reise: Reise[]): Promise<void> {
    reise.forEach(r => {
        console.log(`Reise ID: ${r.r_id}, Name: ${r.r_name}`);
        r.reiseziels.getItems().forEach(rz => {
            console.log(`Reiseziel ID: ${rz.rz_id}, Name: ${rz.rz_Name}`);
        });
        r.teilnehmers.getItems().forEach(u => {
            console.log(`Teilnehmer ID: ${u.u_id}, Name: ${u.u_name}`);
        });
    });
}


export async function getReiseById(id: number): Promise<Reise|null> {
    const orm = await MikroORM.init(defineConfig);
    try{
        const em = orm.em.fork();
        const reise: Reise|null = await em.findOne(Reise, { r_id: id }, {
            populate: ['reiseziels'],  // Explicitly populate reiseziels
            strategy: LoadStrategy.JOINED  // Using JOIN strategy to fetch related entities
        });
        // console.log(`Reise ID: ${reise?.r_id}, Name: ${reise?.r_Name}`);
        return reise;
    }
    catch(error){
        console.error('Failed to fetch Reise:', error);
        throw error;
    }
    finally{
        await orm.close();
    }
}


export async function createReise(reise: Reise): Promise<void> {
    const orm = await MikroORM.init(defineConfig);
    try {
        const em = orm.em.fork();
        const zeitraum = reise.zeitraum;
        console.log('Zeitraum für Reise creating........');
        em.persist(zeitraum);
        await em.flush();
        console.log('Zeitraum für Reise created successfully');
        em.persist(reise);
        await em.flush();
        console.log('Reise created successfully');
    }
    catch (error) {
        console.error('Failed to Push Reise');
        throw error;
    }
    finally{
        await orm.close();
    }
    
}


export async function deleteReiseById(id: number): Promise<void> {
    const orm = await MikroORM.init(defineConfig);
    try {
        const em = orm.em.fork();
        const reise = await em.findOne(Reise, { r_id: id });
        if(!reise){
            console.error('Reise not found');
            throw new Error('Reise not found');
        }

        em.remove(reise);
        await em.flush();
        console.log('Reise deleted successfully');
    }
    catch (error) {
        console.error('Failed to delete Reise');
        throw error;
    }
    finally{
        await orm.close();
    }
    
}

export async function addReisezielToReise(reise_id: number, reiseziel_id: number): Promise<void> {
    const orm = await MikroORM.init(defineConfig); 
    const em = orm.em.fork();

    try {
        // Fetch the Reise and Reiseziel entities using their IDs
        const reise = await em.findOne(Reise, { r_id: reise_id });
        const reiseziel = await em.findOne(Reiseziel, { rz_id: reiseziel_id });

        if (!reise || !reiseziel) {
            throw new Error('Reise or Reiseziel not found');
        }

        // Add Reiseziel to the Reise's collection of Reiseziels
        reise.reiseziels.add(reiseziel);

        // Persist changes to the database
        await em.persistAndFlush(reise);
        console.log('Reiseziel added successfully to Reise');
    } catch (error) {
        console.error('Failed to add Reiseziel to Reise:', error);
        throw error;
    } finally {
        await orm.close();
    }
}



/**
 * search function that use native query
 * Example for native query: 
        select r.*, z.z_startDate, z.z_endDate from reise r join zeitraum z
        on r.z_id = z.z_id 
        where r.r_name ILIKE '%berlin%' 
        and z.z_startDate <= '2024-06-3 00:00:00'
        and z.z_endDate >= '2024-06-14 00:00:00';
 * @param name the string the reise name should contain
 * @param startDate 
 * @param endDate 
 * @returns 
 */

        
export async function searchReiseByNameAndZeitraum(
    name?: string,
    startDate?: Date,
    endDate?: Date
): Promise<Reise[]> {
    const orm = await MikroORM.init(defineConfig);
    const em = orm.em.fork();
    try {
        const qb = em.createQueryBuilder(Reise, 'r')
            .select(['r.*', 'z.z_startDate', 'z.z_endDate', 'rz.rz_name', 'rz.rz_beschreibung'])
            .leftJoinAndSelect('r.zeitraum', 'z')
            .leftJoin('r.reiseziels', 'rz')

        if (name) {
            qb.andWhere(
                '(r.r_name ILIKE ? OR rz.rz_name ILIKE ?)', 
                [`%${name}%`, `%${name}%`]
            );
        }
        if (startDate && !isNaN(startDate.getTime())) {
            qb.andWhere('z.z_startDate >= ?', [startDate]);
        }
        if (endDate && !isNaN(endDate.getTime())) {
            qb.andWhere('z.z_endDate <= ?', [endDate]);
        }

        const results = await qb.getResultList();
        return results;
    } catch (err) {
        console.error('Failed to search Reise by name and Zeitraum:', err);
        throw err;
    } finally {
        await orm.close();
    }
}
