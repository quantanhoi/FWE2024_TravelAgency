import express from 'express';
import * as ReiseMethod from '../../utils/reiseMethod';
import {Reise} from '../../entities/reise';

const router = express.Router();


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


export default router;