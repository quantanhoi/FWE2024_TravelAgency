import express from 'express';
import { Response, Request } from 'express';
import * as authMethod from '../../auth/auth.middleware'
const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { email, name, password } = req.body;
    // Validate input
        if (!email || !name || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }
        else  {
            await authMethod.registerUser(email, name, password)
            return res.status(201).json({status: "Success registering user"});
        }
    }
    catch (error) {
        console.error('Request to register user failed');
        return res.status(406).json({error: "Failed registering user"});
        
    }
    
});

export default router;