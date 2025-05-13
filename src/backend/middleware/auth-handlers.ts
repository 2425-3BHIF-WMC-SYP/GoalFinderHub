import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// use dotenv to load environment variables from .env file!
export function getSecretKey() {
    return process.env.TOKEN_SECRET as string;
}

export interface AuthRequest extends Request {
    payload: JwtPayload;
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            // header does not even contain a Bearer token => respond with Unauthorized
            throw new Error("No bearer token available");
        }

        // check if the token is valid => otherwise an error is thrown
        const decoded: string | JwtPayload = jwt.verify(token, getSecretKey());
        (req as AuthRequest).payload = (decoded as JwtPayload);

        next();
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).send(`Please authenticate! ${err}`);
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if the jwt payload contains an admin role
        const payload = (req as AuthRequest).payload;
        if (payload.user.isAdmin) {
            next();
        }
        else {
            res.status(StatusCodes.UNAUTHORIZED).send('Admin role required');
        }
    } catch (err) {
        // the request has not been authorized before
        res.status(StatusCodes.UNAUTHORIZED).send('Authentication required');
    }
}