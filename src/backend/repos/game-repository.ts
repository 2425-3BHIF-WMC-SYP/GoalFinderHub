import { Database } from "sqlite";
import {Game} from "../database/model";
import {TeamsRepository} from "./teams-repository";

export class GamesRepository {
    public static async getAllGames(db: Database) {
        const rows = await db.all("select * from GAMES order by date desc");

        const games: Game[] = await Promise.all(rows.map(async (row) => {
            const homeTeam = await TeamsRepository.getTeamById(db, row.homeTeamId);
            const awayTeam = await TeamsRepository.getTeamById(db, row.awayTeamId);

            if (!homeTeam || !awayTeam) {
                throw new Error(`Team not found: homeTeamId=${row.homeTeamId}, awayTeamId=${row.awayTeamId}`);
            }

            return {
               id: row.id,
               date: row.date,
               duration: row.duration,
               homeTeamScore: row.homeTeamScore,
               awayTeamScore: row.awayTeamScore,
               homeTeam: homeTeam,
               awayTeam: awayTeam
           }
        }));

        return games;
    }

    public static async insertGame(db: Database, game: Game) {
        const stmt = await db.prepare("insert into GAMES (date, homeTeamScore, awayTeamScore, homeTeamId, awayTeamId) values (?1, ?2, ?3, ?4, ?5)");
        await stmt.bind(game.date, game.homeTeamScore, game.awayTeamScore, game.homeTeam.id, game.awayTeam.id);
        const op = await stmt.run();
        await stmt.finalize();

        return op.lastID;
    }
}
