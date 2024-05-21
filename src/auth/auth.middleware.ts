import { UserData } from "../entities/user";
import * as bcrypt from 'bcryptjs';
import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import * as userMethod from '../utils/userMethod';


const FWE_SECRET = 'SECRET_KEY';
const FWE_OPTIONS: SignOptions = {
    expiresIn: '10h',
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

/**
 * 
 * @param password password sent by client
 * @param hash password saved in database
 * @returns true if password is the same, else false
 */
export async function comparePasswordWithHash(password: string, hash: string) {
    try {
        return await bcrypt.compare(password, hash);
    }
    catch {
        return false;
    }
}

/**
 * 
 * @param email email of new cliet
 * @param name name of new client
 * @param password raw password of new client
 * @returns return UserData type for further operation
 */
export async function registerUser(email: string, name: string, password: string): Promise<UserData> {
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = new UserData(email, name, hashedPassword);
        if(await userMethod.pushUser(newUser)) {
            return newUser;
        }
        else {
            throw new Error("Undefinded User Data");
        }
        
    }
    catch(error ) {
        console.error('Failed to register User');
        throw error;
    }
    
}


/**
 * 
 * @param user UserData in database
 * @returns jwt token for authorization
 */
export function generateToken(user: UserData): string {
    const token = jwt.sign({ email: user.u_email, name: user.u_name }, FWE_SECRET, FWE_OPTIONS);
    return token;
}


/**
 * 
 * @param token token for authorization sent by client
 * @returns true or false
 */
export function verifyToken(token: string): JWTToken {
    return jwt.verify(token, FWE_SECRET, FWE_OPTIONS) as JWTToken;
}


/**
 * 
 * @param password 
 * @param hashedPassword 
 * @returns 
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch {
        return false;
    }
    
}


/**
 * prepare for authorization process
 * @param req request coming from client
 * @param _res response for client
 * @param next next function to execute
 * @tested
 */
export async function prepareAuthentication(req:  Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.get('Authorization');
    if(authHeader) {
        try {
            const token = verifyToken(authHeader);
            //instead of searching user by id, search user by email
            req.user = await userMethod.getUserByEmail(token.email);
            if(!req.user) {
                console.log("email: " + token.email);
                console.log("User is not found through id");
            }

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

/**
 * verify if jwt token is viable
 * @param req request coming from client
 * @param _res response for client
 * @param next next function to execute
 * @returns 
 */
export function verifyAccess(req: Request, res: Response, next: NextFunction) {
    if(!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}