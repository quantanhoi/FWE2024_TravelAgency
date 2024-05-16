import {MikroORM , LoadStrategy} from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'

import { Teilnehmer } from "../entities/teilnehmer";

import { Reise } from "../entities/reise";

export async function getAllTeilnehmers(): Promise<Teilnehmer[]> {
    const orm = await MikroORM.init(defineConfig);
    try{
        const em = orm.em.fork();
        // const teilnehmerRepo = em.getRepository(Teilnehmer);
        // const allTeilnehmer = teilnehmerRepo.findAll();

        const alleTeilnehmer = await em.find(Teilnehmer, {}, {
            populate: ['reises'],
            strategy: LoadStrategy.JOINED
        });
        return alleTeilnehmer;
        
    }
    catch(error){
        console.error('Failed to fetch Teilnehmer:', error);
        throw error;
    }
    finally{
        await orm.close();
    }
    
}


export async function getTeilnehmerById(t_id: number): Promise<Teilnehmer | null> //return either Teilnehmer or null, same with Teilnehmer? in C#
{ 
    const orm = await MikroORM.init(defineConfig); // Ensure MikroORM is initialized with the right config
    try {
        const em = orm.em.fork(); // Create a fork of the EntityManager
        const teilnehmerRepo = em.getRepository(Teilnehmer); // Get the repository for Reiseziel
        const teilnehmer = await teilnehmerRepo.findOne({ t_id }); // Use await to handle the Promise
        return teilnehmer; // Returns the Reiseziel if found, or null if not found
    } catch (error) {
        console.error('Failed to fetch Reiseziel:', error); // Error handling
        throw error; // Re-throw the error for further handling upstream
    } finally {
        await orm.close(); // Ensure the ORM is closed after the operation
    }
}

export async function createTeilnehmer(teilnehmer: Teilnehmer): Promise<void> {
    const orm = await MikroORM.init(defineConfig);
    try {
        const em = orm.em.fork();
        em.persist(teilnehmer);
        await em.flush();
    }
    catch (error) {
        console.error('Failed to Push Teilnehmer');
        throw error;
    }
    finally {
        await orm.close();
    }
}

export async function deleteTeilnehmerById(t_id: number): Promise<void> {
    const orm = await MikroORM.init(defineConfig);
    try {
        const em = orm.em.fork();
        const teilnehmer = await em.findOne(Teilnehmer, {t_id: t_id});
        if(!teilnehmer){
            console.error('Teilnehmer not found');
            throw new Error('Teilnehmer not found');
        }
        em.remove(teilnehmer);
        await em.flush();
        console.log('Teilnehmer deleted successfully');
    }
    catch (error) {
        console.error('Failed to delete Teilnehmer');
        throw error;
    }
    finally {
        await orm.close();
    }
}

export async function addReiseToTeilnehmer(t_id: number, r_id: number): Promise<void> {
    const orm = await MikroORM.init(defineConfig);
    try {
        const em = orm.em.fork();
        const teilnehmer = await em.findOne(Teilnehmer, {t_id: t_id});
        if(!teilnehmer){
            console.error('Teilnehmer not found');
            throw new Error('Teilnehmer not found');
        }
        const reise = await em.findOne(Reise, {r_id: r_id});
        if(!reise){
            console.error('Reise not found');
            throw new Error('Reise not found');
        }
        teilnehmer.reises.add(reise);
        await em.flush();
        console.log('Reise added to Teilnehmer successfully');
    }
    catch (error) {
        console.error('Failed to add Reise to Teilnehmer');
        throw error;
    }
    finally {
        await orm.close();
    }
}