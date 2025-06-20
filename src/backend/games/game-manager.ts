import { Game } from "../database/model";
import {DeviceManager} from "../devices/device-manager";

export class GameManager {
    private localGames: Game[] = [];
    public currentGame: Game | null = null;

    public getAllGames(): Game[] {
        return [...this.localGames];
    }

    private nextId = 1;

    public addGame(game: Game): void {
        if (game.id === undefined) {
            game.id = this.nextId++;
        }
        this.localGames.push({ ...game, started: false });
    }

    public async start(gameId: number): Promise<void> {
        if (this.currentGame) {
            throw new Error("Stop the current Game before starting a new one.");
        }

        const gameIndex = this.localGames.findIndex(g => g.id === gameId);
        if (gameIndex === -1) throw new Error("Game not found");

        this.currentGame = { ...this.localGames[gameIndex], started: true };
        this.localGames[gameIndex].started = true;

        await DeviceManager.getInstance().startDevice(this.localGames[gameIndex].homeDevice.macAddress);
        await DeviceManager.getInstance().startDevice(this.localGames[gameIndex].awayDevice.macAddress);
    }

    public async stop(): Promise<Game> {
        if (!this.currentGame) throw new Error("No game running");
        const finishedGame = this.currentGame;

        await DeviceManager.getInstance().stopDevice(finishedGame.homeDevice.macAddress);
        await DeviceManager.getInstance().stopDevice(finishedGame.awayDevice.macAddress);

        this.currentGame = null;
        return finishedGame;
    }

    public registerHit(macAddress: string) {
        if (!this.currentGame) throw new Error("No game running");

        if(this.currentGame.homeDevice.macAddress === macAddress) {
            this.currentGame.homeTeamScore++;
        }
        else if(this.currentGame.awayDevice.macAddress === macAddress) {
            this.currentGame.awayTeamScore++;
        }
    }
}
