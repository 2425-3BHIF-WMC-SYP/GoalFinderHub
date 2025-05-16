import express from "express";
import { Database } from "sqlite";
import { LeaderboardRepository} from "../repos/leaderboard-repository";
import {DB} from "../database/data";
import {StatusCodes} from "http-status-codes";

export const leaderBoardRouter = express.Router();

let leaderboardRepo: LeaderboardRepository;

export function initLeaderboardRouter(db: Database) {
    leaderboardRepo = new LeaderboardRepository(db);
    return leaderBoardRouter;
}

leaderBoardRouter.get("/", async (req,res) => {
    let db;
    try {
        db = await DB.createDBConnection();
        const leaderboard = await new LeaderboardRepository(db).getLeaderboard();
        res.status(StatusCodes.OK).send(leaderboard);
    } catch (error) {
        console.error(error);
    } finally {
        await db?.close();
    }
});

