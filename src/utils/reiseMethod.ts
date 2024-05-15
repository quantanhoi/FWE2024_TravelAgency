import { LoadStrategy, MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { Reise } from "../entities/reise";



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

//TODO: add function to create new reise in the database