import {Database} from "sqlite";
import {Device, Game, Player, Team, User} from "./model";

import bcrypt from "bcrypt";
import {DevicesRepository} from "../repos/devices-repository";
import {readFile} from "node:fs/promises";

const saltRounds = 8;

export const users: User[] = [{
    firstName: "System",
    lastName: "Admin",
    isAdmin: true,
    username: "admin",
    password: bcrypt.hashSync("pw4admin", saltRounds),
}, {
    firstName: "John",
    lastName: "Doe",
    isAdmin: false,
    username: "john-doe",
    password: bcrypt.hashSync("pw4user", saltRounds),
},];

export const goalfinders: Device[] = [{
    macAddress: "00:1A:7D:DA:71:13", name: "GoalFinder Alpha",
}, {
    macAddress: "00:1A:7D:DA:71:14", name: "GoalFinder Beta",
},];

export const players: Player[] = [{id: 1, name: "Alice Anderson"}, {id: 2, name: "Bob Brown"}, {
    id: 3,
    name: "Charlie Clark"
}, {id: 4, name: "Dana Davis"},];

export const teams: Team[] = [{
    id: 1, name: "Red Hawks"
}, {
    id: 2, name: "Blue Bears"
},];

export const teamsPlayers = [{id: 1, teamId: 1, playerId: 1}, {id: 2, teamId: 1, playerId: 2}, {
    id: 3,
    teamId: 2,
    playerId: 3
}, {id: 4, teamId: 2, playerId: 4},];

export const games: Game[] = [{
    id: 1,
    date: new Date("2025-05-10T14:00:00Z"),
    homeTeamScore: 3,
    awayTeamScore: 2,
    homeTeamId: 1,
    awayTeamId: 2
}, {
    id: 2,
    date: new Date("2025-05-12T16:30:00Z"),
    homeTeamScore: 1,
    awayTeamScore: 1,
    homeTeamId: 2,
    awayTeamId: 1
},];

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