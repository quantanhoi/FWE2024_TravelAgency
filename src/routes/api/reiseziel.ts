import express, {Request, Response} from 'express';
import * as ReisezielMethod from '../../utils/reisezielMethod';
import { Reiseziel } from '../../entities/reiseziel';
import { Zeitraum } from '../../entities/zeitraum';
import { Reise } from '../../entities/reise';
import { prepareAuthentication, verifyAccess } from '../../auth/auth.middleware';

const router = express.Router();
router.use(prepareAuthentication);

router.get('/', verifyAccess, async (req:Request, res: Response) => {
    try {
        console.log("GET REISEZIEL");
        const reiseziel: Reiseziel[] = await ReisezielMethod.getAllReiseziel();
        res.json(reiseziel);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.get('/:id(\\d+)', verifyAccess, async (req: Request, res: Response) => {
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

/**
 * POST request to add reiseziel
 * @tested
 */
router.post('/add', verifyAccess, async(req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        console.log("Route Add Reiseziel");
        const { name, beschreibung, bild, startDate, endDate } = req.body;
    // Validate input
        if (!name || !beschreibung || !bild || !startDate || !endDate) {
            return res.status(400).json({ error: "All fields are required." });
        }
        else {
            const zeitraum = new Zeitraum(new Date(startDate), new Date(endDate));
            const newReiseziel = new Reiseziel(name, beschreibung, bild, zeitraum);
            await ReisezielMethod.createReiseziel(newReiseziel);
            return res.status(201).json({status: "Successfully adding Reiseziel"});
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to add Reiseziel" });
    }
});

/**
 * POST request to delete reiseziel
 * @tested
 */
router.delete('/delete/:id(\\d+)', verifyAccess, async (req: Request, res: Response) => {
    try {
        console.log("Route delete Reise by id");
        await ReisezielMethod.deleteReisezielById(parseInt(req.params.id));
        res.status(200).json({status: "Reise deleted successfully"});
    }
    catch {
        console.error('Request Failed to delete Reiseziel');
        res.status(500).json({ error: "Failed to delete Reiseziel" });
    }

});



export default router;