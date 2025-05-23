import { Database } from "sqlite";

export class GamesRepository {
    public static async getAllGamesWithTeamNames(db: Database) {
        const stmt = await db.prepare(`
        SELECT 
        G.id, 
        G.date, 
        G.homeTeamScore, 
        G.awayTeamScore, 
        G.homeTeamId, 
        G.awayTeamId, 
        HT.name AS homeTeamName,
        AwayTeam.name AS awayTeamName
      FROM GAMES G
      JOIN TEAMS HT ON G.homeTeamId = HT.id
      JOIN TEAMS AwayTeam ON G.awayTeamId = AwayTeam.id
      ORDER BY G.date DESC
    `);

        const games = await stmt.all();
        await stmt.finalize();

        return games;
    }
}
