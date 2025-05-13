export interface User {
    username: string;
    password: string
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}

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

export class Device {
    private readonly _macAddress: string;
    private _name: string;

    //Settings
    private _volume: number = 0;
    private _ledMode: LedMode = LedMode.Off;
    private _vibrationSensorSensitivity: number = 0;

    get vibrationSensorSensitivity(): number {
        return this._vibrationSensorSensitivity;
    }
    get ledMode(): LedMode {
        return this._ledMode;
    }
    get volume(): number {
        return this._volume;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get macAddress(): string {
        return this._macAddress;
    }

    constructor(macAddress: string, name: string) {
        this._macAddress = macAddress;
        this._name = name;
    }
}

enum LedMode {
    Off,
    Blink,
    //TODO
}