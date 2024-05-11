import express from 'express';
import * as ReisezielMethod from '../../utils/reisezielMethod';
import { Reiseziel } from '../../entities/reiseziel';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log("GET REISEZIEL");
        const reiseziel: Reiseziel[] = await ReisezielMethod.getAllReiseziel();
        res.json(reiseziel);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.post('/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const reiseziel: Reiseziel|null = await ReisezielMethod.getReisezielById(parseInt(req.params.id));
        if(!reiseziel) {
            res.status(404).json({ error: "Reiseziel not found"});
            return; //NOTE: must add return here so it will not continue to res.json
        }
        res.json(reiseziel);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

export default router;