import {Database} from "sqlite";
import {DevicesRepository} from "../repos/devices-repository";
import {readFile} from "node:fs/promises";
import {games, goalfinders, players, teams, teamsPlayers, users} from "./sample-data";

export async function dropTables(connection: Database): Promise<void> {
    try {
        const dropSchemaFile: string = await readFile(`./database/drop.sql`, "utf-8");
        await connection.exec(dropSchemaFile);
    } catch (error) {
        throw new Error(`Error dropping tables: ${error}`);
    }
}

export async function ensureSampleDataInserted(db: Database) {
    try {
        await insertUsers(db);
        await insertGoalfinders(db);
        await insertPlayers(db);
        await insertTeams(db);
        await insertTeamPlayers(db);
        await insertGames(db);
    } catch (e) {
        console.log(e);
    }
}

async function insertUsers(db: Database) {
    const stmt = await db.prepare("insert into users (firstName, lastName, username, password, isAdmin) values (?, ?, ?, ?, ?);");

    for (const user of users) {
        const existingUser = await db.get("select * from users where username = ?", user.username);

        if (existingUser === undefined) {
            await stmt.bind(user.firstName, user.lastName, user.username, user.password, user.isAdmin);
            await stmt.run();
        }

        await stmt.reset();
    }

    await stmt.finalize();
}

async function insertGoalfinders(db: Database) {
    const stmt = await db.prepare("insert into GOALFINDERS (MacAddress, Name) values (?, ?);");

    for (const goalfinder of goalfinders) {

        const existingDevice = await DevicesRepository.getDeviceByMacAddress(db, goalfinder.macAddress);

        if (existingDevice === undefined) {
            await stmt.bind(goalfinder.macAddress, goalfinder.name);
            await stmt.run();
        }
        await stmt.reset();
    }

    await stmt.finalize();
}

async function insertPlayers(db: Database) {
    const stmt = await db.prepare("insert into players (name) values (?);");

    for (const player of players) {
        const existingPlayer = await db.get("select * from players where name = ?", player.name);

        if (existingPlayer === undefined) {
            await stmt.bind(player.name);
            await stmt.run();
        }

        await stmt.reset();
    }

    await stmt.finalize();
}

async function insertTeams(db: Database) {
    const stmt = await db.prepare("insert into TEAMS (name) values (?);");

    for (const team of teams) {
        const existingTeam = await db.get("select * from TEAMS where name = ?", team.name);

        if (existingTeam === undefined) {
            await stmt.bind(team.name);
            await stmt.run();
        }

        await stmt.reset();
    }

    await stmt.finalize();
}

async function insertTeamPlayers(db: Database) {
    const stmt = await db.prepare("insert into TEAMS_PLAYERS (teamId, playerId) values (?, ?);");

    for (const teamPlayer of teamsPlayers) {
        const existingTeamPlayer = await db.get("select * from TEAMS_PLAYERS where teamId = ? and playerId = ?", teamPlayer.teamId, teamPlayer.playerId);

        if (existingTeamPlayer === undefined) {
            await stmt.bind(teamPlayer.teamId, teamPlayer.playerId);
            await stmt.run();
        }

        await stmt.reset();
    }

    await stmt.finalize();
}

async function insertGames(db: Database) {
    const stmt = await db.prepare("insert into games (date, homeTeamScore, awayTeamScore, homeTeamId, awayTeamId) values (?, ?, ?, ?, ?);");

    for (const game of games) {
        const existingGame = await db.get("select * from games where id = ?", game.id);

        if (existingGame === undefined) {
            await stmt.bind(game.date.toISOString(), game.homeTeamScore, game.awayTeamScore, game.homeTeamId, game.awayTeamId);
            await stmt.run();
        }

        await stmt.reset();
    }

    await stmt.finalize();
}