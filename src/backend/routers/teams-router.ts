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
        res.status(StatusCodes.OK).send(teams);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

//Get Players By Team
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

//Delete all Team and Player
teamsRouter.delete("/:teamId", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        await TeamsRepository.deleteTeam(db, parseInt(req.params.teamId));
        res.status(StatusCodes.OK).json({ message: "ok" });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

//Delete one Player Only
teamsRouter.delete("/:teamId/:playerId", async (req, res) => {
    const db = await DB.createDBConnection();
    try {
        await TeamsRepository.deletePlayer(db, parseInt(req.params.playerId));
        res.status(StatusCodes.OK).json({ message: "ok" });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

//PUT one Player
teamsRouter.put("/:teamId", async (req, res) => {
    const db = await DB.createDBConnection();
    const playerName = req.body.name;

    try {
        await TeamsRepository.insertPlayer(db, playerName, parseInt(req.params.teamId));
        res.status(StatusCodes.OK).json({ message: "ok" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

//Update Name
teamsRouter.put("/:teamId/:name", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        const stmt = await db.prepare("Update TEAMS set name = ?1 where id = ?2");
        await stmt.bind({
            1: req.params.name,
            2: req.params.teamId
        });

        await stmt.run();
        await stmt.finalize();
        res.status(StatusCodes.OK).json({ message: "ok" });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error}`);
    } finally {
        await db.close();
    }
});

//Post Team and Players
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