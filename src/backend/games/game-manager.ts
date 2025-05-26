import {Game} from "../database/model";
import {GamesRepository} from "../repos/game-repository";
import {DB} from "../database/data";

export class GameManager {
    private readonly MAX_GAME_DURATION: number = 50;

    private intervalId: NodeJS.Timeout | undefined;
    private game: Game | undefined;

    public get currentGame() {
        return this.game;
    }

    public async start(game: Game) {
        await this.stop();

        this.game = game;

        this.intervalId = setInterval(async () => {
            this.game!.duration += 1;

            if (this.game!.duration >= this.MAX_GAME_DURATION) {
                await this.stop();
            }
        }, 1000);

        //TODO: logic for goalfinders hit and miss detection
    }

    public async stop() {
        //TODO: save game in database
        if (this.game) {
            clearInterval(this.intervalId);

            const db = await DB.createDBConnection();

            try {
                await GamesRepository.insertGame(db, this.game);
                this.game = undefined;
            } catch (error) {
                console.error(error);
            } finally {
                await db.close();
            }
        }
    }
}