import express from 'express';
import { Response, Request } from 'express';
import * as authMethod from '../../auth/auth.middleware'
import * as userMethod from '../../utils/userMethod'
const router = express.Router();
router.use(authMethod.prepareAuthentication);

router.post('/register', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { email, name, password } = req.body;
    // Validate input
        if (!email || !name || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }
        else  {
            const user = await authMethod.registerUser(email, name, password);
            const jwtToken = authMethod.generateToken(user);
            return res.status(201).json({status: "Success registering user", 
                jwtToken: jwtToken
            });
        }
    }
    catch (error) {
        console.error('Request to register user failed');
        return res.status(406).json({error: "Failed registering user"});
        
    }
    
});

//TODO: instead of searching user by id, search user by email which is included in the token
router.get('/:id(\\d+)', authMethod.verifyAccess, async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await userMethod.getUserDtoById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        else{
            return res.status(200).json(user);
        }
        
    } catch (err) {
        console.error('Failed to fetch user:', err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

router.get('/login', async(req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }
        const user = await userMethod.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check password
        const passwordIsValid = await authMethod.comparePasswordWithHash(password, user.u_password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: "Invalid password" });
        }
        // Generate and return JWT
        const jwtToken = authMethod.generateToken(user);
        return res.status(200).json({ jwtToken });
    }
    catch(err) {
        console.error('Failed to log in:', err);
        res.status(500).json({ error: "Failed to log in" });
    }
});

export default router;