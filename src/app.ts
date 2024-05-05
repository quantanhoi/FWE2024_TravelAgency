


import { MikroORM } from '@mikro-orm/core';
import defineConfig from './mikro-orm.config'
import * as ReiseMethod from './utils/reiseMethod'
async function main() {
    // const orm = await MikroORM.init(defineConfig);  // init using defined config in mikro-orm.config.ts
    // const em = orm.em.fork();  // Create a forked EntityManager

    // // Now use `em` to run your queries (like JPA)
    // const teilnehmers = await em.find(Teilnehmer, {});
    // teilnehmers.forEach(teilnehmer => console.log(teilnehmer.t_Name));

    // await orm.close();
    ReiseMethod.getAllReise();

}

main().catch(console.error);