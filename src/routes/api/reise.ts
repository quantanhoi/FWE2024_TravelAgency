import express, {Request, Response} from 'express';
import * as ReiseMethod from '../../utils/reiseMethod';
import {Reise} from '../../entities/reise';
import { Zeitraum } from '../../entities/zeitraum';

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
router.post('/:id(\\d+)', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        console.log("Route search Reise by id");
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

router.post('/add', async(req:Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        console.log("Route Add Reise");
        const { name, beschreibung, bild, startDate, endDate } = req.body;
    // Validate input
        if (!name || !beschreibung || !bild || !startDate || !endDate) {
            return res.status(400).json({ error: "All fields are required." });
        }
        else  {
            //for Date format example, checkout data.sql in doc
            const zeirtaum = new Zeitraum(new Date(startDate), new Date(endDate));
            const reise = new Reise(name, beschreibung, bild, zeirtaum);
            await ReiseMethod.createReise(reise);
            return res.status(201).json({status: "Success registering user"});
        }
    }
    catch (error) {
        console.error('Request to add trip failed');
        return res.status(406).json({error: "failed adding trip!"});
        
    }
});


export default router;