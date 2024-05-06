import {MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'

import { Teilnehmer } from "../entities/teilnehmer";

export async function getAllReiseziel(): Promise<Teilnehmer[]> {
    const orm = await MikroORM.init(defineConfig);
    try{
        const em = orm.em.fork();
        const teilnehmerRepo = em.getRepository(Teilnehmer);
        const allTeilnehmer = teilnehmerRepo.findAll();
        return allTeilnehmer;
        
    }
    finally{
        await orm.close();
    }
    
}


async function getAllTeilnehmers(t_id: number): Promise<Teilnehmer | null> //return either Teilnehmer or null, same with Teilnehmer? in C#
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