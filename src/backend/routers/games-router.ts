import express from "express";
import { DB } from "../database/data";
import { StatusCodes } from "http-status-codes";
import { Game } from "../database/model";
import { GamesRepository } from "../repos/game-repository";
import { GameManager } from "../games/game-manager";

export const gamesRouter = express.Router();
const gameManager = new GameManager();

gamesRouter.get("/", async (req, res) => {
    const db = await DB.createDBConnection();
    try {
        const games = await GamesRepository.getAllGames(db);
        res.status(StatusCodes.OK).send(games);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

gamesRouter.post("/", async (req, res) => {
    try {
        const game: Game = req.body;
        gameManager.addGame(game);
        res.status(StatusCodes.CREATED).send(game);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    }
});


gamesRouter.delete("/:id", async (req, res) => {
    const gameId = Number(req.params.id);
    if (isNaN(gameId)) {
        res.status(StatusCodes.BAD_REQUEST).send("Invalid game ID");
    }

    const db = await DB.createDBConnection();
    try {
        const result = await db.run("DELETE FROM GAMES WHERE id = ?", gameId);

        if (result.changes === 0) {
            res.status(StatusCodes.NOT_FOUND).send("Game not found");
        }

        res.status(StatusCodes.OK).send("Game deleted");
    } catch (error) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await db.close();
    }
});

gamesRouter.get("/current", async (req, res) => {
    try {
        const currentGame = gameManager.currentGame;
        res.send(currentGame);
    } catch (error) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

gamesRouter.post("/start/:id", async (req, res) => {
    try {
        const gameId = Number(req.params.id);
        await gameManager.start(gameId);
        res.status(StatusCodes.OK).send(gameId);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    }
});

gamesRouter.post("/stop", async (req, res) => {
    const db = await DB.createDBConnection();
    try {
        const finishedGame = await gameManager.stop();
        await GamesRepository.insertGame(db, finishedGame);
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

gamesRouter.get("/local", (req, res) => {
    try {
        const games = gameManager.getAllGames().filter(game => !game.started);
        res.status(StatusCodes.OK).send(games);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    }
});

gamesRouter.post("/local", (req, res) => {
    try {
        const game: Game = req.body;
        game.started = false;
        gameManager.addGame(game);
        res.status(StatusCodes.CREATED).send(game);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    }
});
