import express, {Response, Request} from 'express';
import * as teilnehmeMethod from '../../utils/teilnehmerMethod'
import { Teilnehmer } from '../../entities/teilnehmer';
import { prepareAuthentication, verifyAccess } from '../../auth/auth.middleware';


const router = express.Router();
router.use(prepareAuthentication);

router.get('/', verifyAccess, async(req: Request, res:Response) => {
    try{
        console.log("GET TEILNEHME");
        const teilnehmers: Teilnehmer[] = await teilnehmeMethod.getAllTeilnehmers();
        res.json(teilnehmers);
    }
    catch(e) {
        console.log(e);
        res.status(500).json({error: "Failed to fetch data"});
    }
});

router.post('/:id(\\d+)', verifyAccess, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const teilnehmer: Teilnehmer|null = await teilnehmeMethod.getTeilnehmerById(parseInt(req.params.id));
        if(!teilnehmer) {
            res.status(404).json({error: "Teilnehmer not found"});
            return;
        }
        else {
            res.json(teilnehmer)
        }
    }
    catch(e) {
        console.log(e) 
        res.status(500).json({error: "Failed to fetch data"});
        
    }
});


/**
 * POST request to add teilnehmer
 * @tested
 */
router.post('/add', verifyAccess, async(req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        console.log("Route Add Teilnehmer");
        const {name} = req.body;
        if(!name) {
            return res.status(400).json({error: "All fields are required."});
        }
        else {
            const newTeilnehmer = new Teilnehmer(name);
            await teilnehmeMethod.createTeilnehmer(newTeilnehmer);
            return res.status(201).json({status: "Successfully adding Teilnehmer"});
        }
    }
    catch(e) {
        console.log(e);
        res.status(500).json({error: "Failed to add Teilnehmer"});
    }
});


/**
 * POST request to delete teilnehmer
 * @tested
 */
router.post('/delete/:id(\\d+)', verifyAccess, async(req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        console.log("Route Delete Teilnehmer");
        await teilnehmeMethod.deleteTeilnehmerById(parseInt(req.params.id));
        res.status(200).json({status: "Reise deleted successfully"});
    }
    catch(e) {
        console.log(e);
        res.status(500).json({error: "Failed to delete Teilnehmer"});
    }
});


/**
 * Add reise to a teilnehmer
 */
router.post('/addReise/:t_id(\\d+)/:r_id(\\d+)', verifyAccess, async(req: Request, res: Response) => {
    try {
        console.log("Route Add Reise to Teilnehmer");
        await teilnehmeMethod.addReiseToTeilnehmer(parseInt(req.params.t_id), parseInt(req.params.r_id));
        res.status(200).json({status: "Reise added to Teilnehmer successfully"});
    }
    catch(e) {
        console.log(e);
        res.status(500).json({error: "Failed to add Reise to Teilnehmer"});
    }
});

export default router;