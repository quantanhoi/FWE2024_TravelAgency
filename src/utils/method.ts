import { LoadStrategy, MikroORM } from "@mikro-orm/postgresql";
import defineConfig from '../mikro-orm.config'
import { Reise } from "../entities/reise";
import { Reiseziel} from "../entities/reiseziel";
import { Teilnehmer } from "../entities/teilnehmer";
import { Zeitraum } from "../entities/zeitraum";


export async function getAllReise(): Promise<void> {
    const orm = await MikroORM.init(defineConfig);
    const em = orm.em.fork();
    const reise = await em.find(Reise, {}, {
        populate: ['reiseziels'],  // Explicitly populate reiseziels
        strategy: LoadStrategy.JOINED  // Using JOIN strategy to fetch related entities
    });
    reise.forEach(r => {
        console.log(`Reise ID: ${r.r_id}, Name: ${r.r_Name}`);
        r.reiseziels.getItems().forEach(rz => {
            console.log(`Reiseziel ID: ${rz.rz_id}, Name: ${rz.rz_Name}`);
        });
    });
    await orm.close();
}