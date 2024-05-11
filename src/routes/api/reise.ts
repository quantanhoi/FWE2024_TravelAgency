import express from 'express';
import * as ReiseMethod from '../../utils/reiseMethod';
import {Reise} from '../../entities/reise';

const router = express.Router();

/**
 * GET request to fetch all reise
 * @returns all reise as json
 * @tested
 */
router.get('/', async (req, res) => {
    try{
        console.log("GET REISE");
        const reise: Reise[] = await ReiseMethod.getAllReise();
        res.json(reise);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
    

});

/**
 * POST request to fetch reise by id
 * @returns specific reise object with id or null if not found
 * @tested
 */
router.post('/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const reise: Reise|null = await ReiseMethod.getReiseById(parseInt(req.params.id));
        if(!reise) {
            res.status(404).json({ error: "Reise not found"});
            return; //NOTE: must add return here so it will not continue to res.json
        }
        res.json(reise);

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});


export default router;