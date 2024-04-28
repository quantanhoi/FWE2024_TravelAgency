// src/index.js
// import express, { Express, Request, Response } from "express";
// import dotenv from "dotenv";


// dotenv.config();

// const app: Express = express();
// const port = process.env.PORT || 3000;

// app.get("/", (req: Request, res: Response) => {
//     res.send("Express + TypeScript Server");
// });

// app.listen(port, () => {
//     console.log(`[server]: Server is running at http://localhost:${port}`);
// });


import { MikroORM } from '@mikro-orm/core';
import defineConfig from './mikro-orm.config'
import { Teilnehmer } from './entities/teilnehmer';
async function main() {
    const orm = await MikroORM.init(defineConfig);  // init using defined config in mikro-orm.config.ts
    const em = orm.em.fork();  // Create a forked EntityManager

    // Now use `em` to run your queries (like JPA)
    const teilnehmers = await em.find(Teilnehmer, {});
    teilnehmers.forEach(teilnehmer => console.log(teilnehmer.t_Name));

    await orm.close();
}

main().catch(console.error);