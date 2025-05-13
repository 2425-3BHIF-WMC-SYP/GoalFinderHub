import express from "express";
import {User} from "../database/model";
import {DB} from "../database/data";
import {StatusCodes} from "http-status-codes";
import {UsersRepository} from "../repos/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {getSecretKey} from "../middleware/auth-handlers";

interface TokenResponse {
    user: {
        firstName: string,
        lastName: string,
        isAdmin: boolean;
    };
    expiresAt: Date;
    message: string;
    accessToken: string;
}

export interface UserCredentials {
    username: string;
    password: string;
}

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(StatusCodes.BAD_REQUEST).json("Username and password are required");
        return;
    }

    const db = await DB.createDBConnection();

    try {
        const user: User | undefined = await UsersRepository.GetUser(db, req.body.username);
        // In real applications, you should only return UNAUTHORIZED without meantioning the reason why
        // for security reasons. This is just for demonstration purposes.
        // You should also use HTTPS to protect the password in transit.
        if (!user) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
        } else {
            const match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                const tokenResponse = createJwtToken(user);
                res.status(StatusCodes.OK).send(tokenResponse);
            } else {
                res.status(StatusCodes.UNAUTHORIZED).send("Invalid Username or Password");
            }
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await db.close();
    }
});

function createJwtToken(user: User): TokenResponse {
    const userClaims = {
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin
    };
    const token = jwt.sign({
        user: userClaims
    }, getSecretKey(), {
        expiresIn: '30m'
    });

    // the exakt token expiration date is in seconds since 1970-01-01T00:00:00Z
    const {exp} = jwt.decode(token) as {
        exp: number;
    };
    // so we need to multiply it by 1000 to get milliseconds
    const expires = new Date(exp * 1000);
    return {
        user: userClaims,
        expiresAt: expires,
        message: "Login successfull",
        accessToken: token
    };
}