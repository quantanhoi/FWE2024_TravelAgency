import { UserData } from "../entities/user";
import * as bcrypt from 'bcryptjs';
import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import * as userMethod from '../utils/userMethod';


const FWE_SECRET = 'SECRET_KEY';
const FWE_OPTIONS: SignOptions = {
    expiresIn: '1h',
    algorithm: 'HS256',
    issuer: 'http://fwe.auth'
}
declare global {
    namespace Express {
            interface Request {
                user: UserData|null;
                token: JWTToken|null;
            }
        }
}
export type JWTToken = UserData & JwtPayload

// Generate a new salt
const generateSalt = async () => {
    return await bcrypt.genSalt(12);  // 12 is the cost factor
};

// Use this generated salt when hashing passwords
const hashPassword = async (password: string) => {
    const salt = await generateSalt();
    return bcrypt.hash(password, salt);
};

// const comparePasswordWithHash = async (password: string, hash: string) => {
//     try {
//         return await bcrypt.compare(password, hash);
//     }
//     catch {
//         return false;
//     }
// }

export async function comparePasswordWithHash(password: string, hash: string) {
    try {
        return await bcrypt.compare(password, hash);
    }
    catch {
        return false;
    }
}
export async function registerUser(email: string, name: string, password: string): Promise<boolean> {
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = new UserData(email, name, hashedPassword);
        if(await userMethod.pushUser(newUser)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch(error ) {
        console.error('Failed to register User');
        return false;
    }
    
}

export function generateToken(user: UserData): string {
    const token = jwt.sign({ email: user.u_email, name: user.u_name }, FWE_SECRET, FWE_OPTIONS);
    return token;
}

export function verifyToken(token: string): JWTToken {
    return jwt.verify(token, FWE_SECRET, FWE_OPTIONS) as JWTToken;
}


export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch {
        return false;
    }
    
}

export async function prepareAuthentication(req:  Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.get('Authorization');
    if(authHeader) {
        try {
            const token = verifyToken(authHeader);
            req.user = await userMethod.getUserById(token.id);
            req.token = token;
        }
        catch (err) 
        {
            console.log(err);
        }
    }
    else{
        req.user = null;
        req.token = null;
    }
    next();
}

// const verifyAccess: RequestHandler = (req: Request, _res: Response, next: NextFunction) => 
// {
//     if(!req.user) {
//         return _res.status(401).json({ error: "Unauthorized" });
//     }
//     next();
// }

export function verifyAccess(req: Request, res: Response, next: NextFunction) {
    if(!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}