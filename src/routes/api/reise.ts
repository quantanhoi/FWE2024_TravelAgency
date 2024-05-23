
import express, {Request, Response} from 'express';
import * as ReiseMethod from '../../utils/reiseMethod';
import {Reise} from '../../entities/reise';
import { Zeitraum } from '../../entities/zeitraum';
import { prepareAuthentication, verifyAccess } from '../../auth/auth.middleware';
import { verify } from 'jsonwebtoken';

const router = express.Router();
router.use(prepareAuthentication)
/**
 * GET request to fetch all reise
 * @returns all reise as json
 * @tested
 */
router.get('/', verifyAccess, async (req: Request, res: Response) => {
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
 * TODO: change this to get?
 * @returns specific reise object with id or null if not found
 * @tested
 */
router.get('/:id(\\d+)', verifyAccess ,async (req: Request, res: Response) => {
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


/**
 * POST request to add reise
 * @returns status of the request
 * @tested
 */
router.post('/add', verifyAccess ,async(req:Request, res: Response) => {
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
            const zeitraum = new Zeitraum(new Date(startDate), new Date(endDate));
            const reise = new Reise(name, beschreibung, bild, zeitraum);
            await ReiseMethod.createReise(reise);
            return res.status(201).json({status: "Successfully adding reise"});
        }
    }
    catch (error) {
        console.error('Request to add trip failed');
        return res.status(406).json({error: "failed adding trip!"});
        
    }
});


/**
    * POST request to delete reise by id
    * @returns status of the request
    * @tested
    
 */
router.delete('/delete/:id(\\d+)',  verifyAccess ,async (req: Request, res: Response) => {
    try {
        console.log("Route delete Reise by id");
        await ReiseMethod.deleteReiseById(parseInt(req.params.id));
        res.status(200).json({status: "Reise deleted successfully"});
    }
    catch {
        console.error('Request Failed to delete Reise');
        res.status(500).json({ error: "Failed to delete Reise" });
    }

});

/**
 * POST request to to add reiseziel to reise by id of reiseziel and reise
 * @tested
 */
router.post('/addReiseziel/:id(\\d+)/:idReiseziel(\\d+)', verifyAccess,async (req: Request, res: Response) => {
    try {
        console.log("Route add Reiseziel to Reise");
        await ReiseMethod.addReisezielToReise(parseInt(req.params.id), parseInt(req.params.idReiseziel));
        res.status(200).json({status: "Reiseziel added to Reise successfully"});
    }
    catch {
        console.error('Request Failed to add Reiseziel to Reise');
        res.status(500).json({ error: "Failed to add Reiseziel to Reise" });
    }
});

/**
 * GET request to search for reise by name and zeitraum
 * @returns matching reise objects as json
 */
router.get('/search', verifyAccess, async (req: Request, res: Response) => {
    try {
        console.log("Route search Reise by name and zeitraum");
        const { name, startDate, endDate } = req.body;
        const reise: Reise[] = await ReiseMethod.searchReiseByNameAndZeitraum(name as string, new Date(startDate as string), new Date(endDate as string));
        res.json(reise);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to search reise" });
    }
});

export default router;