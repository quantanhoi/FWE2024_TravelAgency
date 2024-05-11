


import { MikroORM } from '@mikro-orm/core';
import defineConfig from './mikro-orm.config'
import * as ReiseMethod from './utils/reiseMethod'
import express from 'express';
import reiseRoute from './routes/api/reise';
import reisezielRoute from './routes/api/reiseziel';
const app = express();
const port = 3000;
app.use(express.json());
app.use('/api/reise', reiseRoute);
app.use('/api/reiseziel', reisezielRoute);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});