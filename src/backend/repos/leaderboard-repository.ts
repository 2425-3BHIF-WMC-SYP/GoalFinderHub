import {TeamStanding} from "../database/model";
import {Database} from "sqlite";

export class LeaderboardRepository {
    public static async getLeaderboard(db: Database): Promise<TeamStanding[]> {
        const query = `
            WITH game_results AS (
                SELECT
                    homeTeamId AS team_id,
                    homeTeamScore AS goals_for,
                    awayTeamScore AS goals_against,
                    CASE
                        WHEN homeTeamScore > awayTeamScore THEN 2
                        WHEN homeTeamScore = awayTeamScore THEN 1
                        ELSE -2
                        END AS points,
                    CASE
                        WHEN homeTeamScore > awayTeamScore THEN 1
                        ELSE 0
                        END AS wins,
                    CASE
                        WHEN homeTeamScore = awayTeamScore THEN 1
                        ELSE 0
                        END AS draws,
                    CASE
                        WHEN homeTeamScore < awayTeamScore THEN 1
                        ELSE 0
                        END AS losses
                FROM GAMES

                UNION ALL

                SELECT
                    awayTeamId AS team_id,
                    awayTeamScore AS goals_for,
                    homeTeamScore AS goals_against,
                    CASE
                        WHEN awayTeamScore > homeTeamScore THEN 2
                        WHEN awayTeamScore = homeTeamScore THEN 1
                        ELSE -2
                        END AS points,
                    CASE
                        WHEN awayTeamScore > homeTeamScore THEN 1
                        ELSE 0
                        END AS wins,
                    CASE
                        WHEN awayTeamScore = homeTeamScore THEN 1
                        ELSE 0
                        END AS draws,
                    CASE
                        WHEN awayTeamScore < homeTeamScore THEN 1
                        ELSE 0
                        END AS losses
                FROM GAMES
            )

            SELECT
                t.id AS teamId,
                t.name AS teamName,
                SUM(gr.points) AS points,
                SUM(gr.wins) AS wins,
                SUM(gr.draws) AS draws,
                SUM(gr.losses) AS losses,
                SUM(gr.goals_for) AS goalsFor,
                SUM(gr.goals_against) AS goalsAgainst,
                (SUM(gr.goals_for) - SUM(gr.goals_against)) AS goalDifference
            FROM game_results gr
                     JOIN TEAMS t ON gr.team_id = t.id
            GROUP BY t.id, t.name
            ORDER BY points DESC, goalDifference DESC, goalsFor DESC
            LIMIT 10
        `;

        return await db.all<TeamStanding[]>(query);
    }
}