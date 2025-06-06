import {Player, Team} from "../database/model";
import {Database} from "sqlite";

export class TeamsRepository {
    public static async getAllTeams(db: Database): Promise<Team[]> {
        const stmt = await db.prepare("select * from TEAMS");
        const teams: Team[] = await stmt.all<Team[]>();
        await stmt.finalize();
        return teams;
    }

    public static async getTeamById(db: Database, id: number): Promise<Team | undefined> {
        const stmt = await db.prepare("select * from TEAMS where id = ?;");
        await stmt.bind(id);
        const team = await stmt.get<Team>();
        await stmt.finalize();

        return team;
    }

    public static async getAllPlayersByTeam(db: Database, teamId: Number | undefined): Promise<(Player | undefined)[]> {
        const getStmt = await db.prepare("select playerId from TEAMS_PLAYERS where teamId = ?1");
        let players : (Player | undefined) [] = [];
        let playerIds;

        try {
            await getStmt.bind({
                1: teamId
            });

            playerIds = await getStmt.all();
        }
        catch (error){
            throw error;
        }
        finally {
            await getStmt.finalize();
        }

        const stmt = await db.prepare("select * from PLAYERS where id = ?1");

        try {
            for(let i = 0; i < playerIds.length; i++) {
                await stmt.bind({
                    1: playerIds[i].playerId
                });

                const p = await stmt.get<Player>();
                players.push(p);
                await stmt.reset();
            }
        }
        catch (error){
            throw error;
        }
        finally {
            await stmt.finalize();
        }

        return players;
    }

    public static async insertTeam(db: Database, name: string): Promise<Number | undefined> {
        const stmt = await db.prepare("insert into TEAMS (name) values (?1)");
        let opResult ;
        try {
            await stmt.bind({
                1: name,
            });
            opResult = await stmt.run();
        }
        catch (error){
            throw error;
        }
        finally {
            await stmt.finalize();
        }

        return opResult.lastID;
    }

    public static async insertPlayers(db: Database, players: Player[]): Promise<(Number | undefined)[]> {
        const stmt = await db.prepare("insert into PLAYERS (name) values (?1)");
        const ids = [];
        try {

            for(const player of players) {
                await stmt.bind({
                    1: player
                });

                const opResult = await stmt.run();
                await stmt.reset();
                ids.push(opResult.lastID);
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            await stmt.finalize();
        }

        return ids;
    }

    public static async insertPlayer(db: Database, name: String, teamId: Number | undefined): Promise<void> {
        const stmt = await db.prepare("insert into PLAYERS (name) values (?1)");
        let id;
        try {
            await stmt.bind({
                1: name
            });

            const result = await stmt.run();
            id = result.lastID;
        }
        catch (error) {
            throw error;
        }
        finally {
            await stmt.finalize();
        }

        await this.insertPlayerTeams(db, id, teamId);
    }

    public static async insertPlayerTeams(db: Database, playerId: Number | undefined, teamId: Number | undefined): Promise<void> {
        const stmt = await db.prepare("insert into TEAMS_PLAYERS (teamId, playerID) values (?1, ?2)");

        try {
            await stmt.bind({
                1: teamId,
                2: playerId
            });

            await stmt.run();
        }
        catch (error) {
            throw error;
        }
        finally {
            await stmt.finalize();
        }
    }

    public static async insertTeamPlayers(db: Database, teamId: Number | undefined, playersIds: (Number | undefined)[] ): Promise<void> {
        const stmt = await db.prepare("insert into TEAMS_PLAYERS (TeamId, PlayerId) values(?1, ?2)");
        try {
            for(const playerId of playersIds) {
                await stmt.bind({
                    1: teamId,
                    2: playerId
                });

                await stmt.run();
                await stmt.reset();
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            await stmt.finalize();
        }
    }

    public static async deletePlayers(db: Database, players: (Player | undefined)[]): Promise<void> {
        const playerStmt = await db.prepare("delete from PLAYERS where id = ?1");

        try {
            for(const player of players) {
                await playerStmt.bind({
                    1: player?.id
                });

                await playerStmt.run();
                await playerStmt.reset();
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            await playerStmt.finalize();
        }
    }

    public static async deleteTeam(db: Database, teamId: Number | undefined): Promise<void> {
        const teamPlayerStmt = await db.prepare("delete from TEAMS_PLAYERS where playerId = ?1");
        const players: (Player | undefined)[] = await this.getAllPlayersByTeam(db, teamId);

        try {
            for(const player of players) {
                await teamPlayerStmt.bind({
                    1: player?.id
                });

                await teamPlayerStmt.run();
                await teamPlayerStmt.reset();
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            await teamPlayerStmt.finalize();
        }


        await this.deletePlayers(db, players);

        const teamsStmt = await db.prepare("delete from TEAMS where id = ?1");

        try {
            await teamsStmt.bind({
                1: teamId
            });
            await teamsStmt.run();
        }
        catch (error) {
            throw error;
        }
        finally {
            await teamsStmt.finalize();
        }
    }

    public static async deletePlayer(db: Database, playerId: Number): Promise<void> {
        const getStmt  = await db.prepare("delete from TEAMS_PLAYERS where playerId = ?1");
        try {
            await getStmt.bind({
                1: playerId
            });

            await getStmt.run();
        }
        catch (error) {
            throw error;
        }
        finally {
            await getStmt.finalize();
        }

        const playerStmt = await db.prepare("delete from PLAYERS where id = ?1");
        try {
            await playerStmt.bind({
                1: playerId
            });

            await playerStmt.run();
        }
        catch (error) {
            throw error;
        }
        finally {
            await playerStmt.finalize();
        }
    }
}