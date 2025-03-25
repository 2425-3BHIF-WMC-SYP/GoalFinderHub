export interface Player {
    id: number;
    name: string;
}

export class Team {
    private id: number = -1;
    private players: Player[] = [];

    public addPlayer(player: Player): void {
        this.players.push(player);
    }

    public getPlayers(): Player[] {
        return this.players;
    }
}

export interface Device {
    macAddress: string;
    name: string;
}