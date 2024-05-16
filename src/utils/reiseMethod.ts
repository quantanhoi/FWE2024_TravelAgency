import { LoadStrategy, MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { Reise } from "../entities/reise";
import { Reiseziel } from "../entities/reiseziel";



export async function getAllReise(): Promise<Reise[]> {
    const orm = await MikroORM.init(defineConfig);
    try{
        const em = orm.em.fork();
        const reise = await em.find(Reise, {}, {
            populate: ['reiseziels', 'teilnehmers'],  // Explicitly populate reiseziels
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
        r.teilnehmers.getItems().forEach(t => {
            console.log(`Teilnehmer ID: ${t.t_id}, Name: ${t.t_Name}`);
        });
    });
}


export async function getReiseById(id: number): Promise<Reise|null> {
    const orm = await MikroORM.init(defineConfig);
    try{
        const em = orm.em.fork();
        const reise: Reise|null = await em.findOne(Reise, { r_id: id }, {
            populate: ['reiseziels', 'teilnehmers'],  // Explicitly populate reiseziels
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
    const orm = await MikroORM.init(defineConfig); // Make sure defineConfig is properly configured elsewhere
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

//TODO: add function to create new reise in the database