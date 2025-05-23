import express from "express";
import { DB } from "../database/data";
import { DevicesRepository } from "../repos/devices-repository";
import { StatusCodes } from "http-status-codes";
import { Device, Game } from "../database/model";
import { GamesRepository } from "../repos/game-repository";

export const gamesRouter = express.Router();

gamesRouter.post("/", async (req, res) => {
    const db = await DB.createDBConnection();
    const gameData: Game = req.body.gameData;
    console.log(gameData);
    try {
        const stmt = await db.prepare('INSERT INTO GAMES (homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, date) VALUES (?1, ?2, ?3, ?4, ?5)');

        try {
            await stmt.bind({
                1: gameData.homeTeamId,
                2: gameData.awayTeamId,
                3: gameData.homeTeamScore,
                4: gameData.awayTeamScore,
                5: gameData.date
            });

            const op = await stmt.run();

            if (op.changes !== 1) {
                throw new Error("Error op");
            }
        } catch (e) {
            throw new Error(e.message);
        } finally {
            await stmt.finalize();
        }

        res.status(StatusCodes.CREATED).send(gameData);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST);
    } finally {
        await db.close();
    }
});

gamesRouter.get("/latest", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        const result = await db.get('SELECT * FROM GAMES ORDER BY id DESC LIMIT 1');
        if (!result) {
            return res.status(StatusCodes.NOT_FOUND).send("No games found.");
        }

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await db.close();
    }
});

gamesRouter.get("/exceptLatest", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        const latestGame = await db.get('SELECT * FROM GAMES ORDER BY id DESC LIMIT 1');
        if (!latestGame) {
            return res.status(StatusCodes.NOT_FOUND).send("No games found.");
        }

        const otherGames = await db.all('SELECT * FROM GAMES WHERE id != ? ORDER BY id DESC', [latestGame.id]);

        res.status(StatusCodes.OK).json(otherGames);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await db.close();
    }
});

gamesRouter.delete("/:id", async (req, res) => {
    const gameId = Number(req.params.id);
    if (isNaN(gameId)) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid game ID");
    }

    const db = await DB.createDBConnection();

    try {
        const result = await db.run("DELETE FROM GAMES WHERE id = ?", gameId);
        if (result.changes === 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Game not found");
        }
        res.status(StatusCodes.OK).send("Game deleted");
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await db.close();
    }
});

gamesRouter.get("/", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        const games = await GamesRepository.getAllGamesWithTeamNames(db);
        res.status(StatusCodes.OK).send(games);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});
