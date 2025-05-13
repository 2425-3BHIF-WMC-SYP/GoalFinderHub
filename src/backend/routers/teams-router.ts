import express from "express";
import {DB} from "../database/data";
import {TeamsRepository} from "../repos/teams-repository";
import {StatusCodes} from "http-status-codes";
import {Player, Team} from "../database/model";

export const teamsRouter = express.Router();

teamsRouter.get("/", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        const teams = await TeamsRepository.getAllTeams(db);
        res.send("Ok");
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

teamsRouter.get("/:teamId", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        const players: (Player | undefined)[] = await TeamsRepository.getAllPlayersByTeam(db, parseInt(req.params.teamId));
        res.status(200).send(players);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

teamsRouter.post("/", async (req, res) => {
    const db = await DB.createDBConnection();
    const name: string = req.body.name;
    const players: Player[] = req.body.players;

    if(name === undefined || players.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).send("Missing Fields");
        return;
    }

    try {
        const teamId = await TeamsRepository.insertTeam(db, name);
        const playersIds = await TeamsRepository.insertPlayers(db, players);
        await TeamsRepository.insertTeamPlayers(db, teamId, playersIds);
        const team = {
            name: name,
            players: playersIds
        };

        res.status(StatusCodes.OK).send(team);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});