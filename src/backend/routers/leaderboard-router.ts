import express from "express";
import {LeaderboardRepository} from "../repos/leaderboard-repository";
import {DB} from "../database/data";
import {StatusCodes} from "http-status-codes";

export const leaderboardRouter = express.Router();

leaderboardRouter.get("/", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        const leaderboard = LeaderboardRepository.getLeaderboard(db);
        res.status(StatusCodes.OK).send(leaderboard);
    } catch (error) {
        console.error(error);
    } finally {
        await db.close();
    }
});

