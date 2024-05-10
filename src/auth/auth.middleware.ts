import { userData } from "../entities/user";
import * as bcrypt from 'bcryptjs';
import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import * as userMethod from '../utils/userMethod';

const FWE_SALT = '10';
const FWE_SECRET = 'SECRET_KEY';
const FWE_OPTIONS: SignOptions = {
    expiresIn: '1h',
    algorithm: 'HS256',
    issuer: 'http://fwe.auth'
}
declare global {
    namespace Express {
            interface Request {
                user: userData|null;
                token: JWTToken|null;
            }
        }
}
export type JWTToken = userData & JwtPayload

const hashPassword = (password: string) => bcrypt.hash(password, FWE_SALT);

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
export async function registerUser(email: string, name: string, password: string): Promise<userData> {
    const hashedPassword = await hashPassword(password);
    const newUser = new userData(email, name, hashedPassword);
    //TODO: push the new user here
    return newUser;
}

export function generateToken(user: userData): string {
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