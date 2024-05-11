import express from 'express';
import * as teilnehmeMethod from '../../utils/teilnehmerMethod'
import { Teilnehmer } from '../../entities/teilnehmer';


const router = express.Router();

router.get('/', async(req, res) => {
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

router.post('/:id', async (req, res) => {
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