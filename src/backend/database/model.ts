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

export interface Team {
    id: number;
    name: string;
}

export interface Device {
    macAddress: string;
    name: string;
}

export interface TeamStanding {
    teamId: number;
    teamName: string;
    points: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
}
export interface Game {
    id: number;
    date: Date;
    homeTeamScore: number;
    awayTeamScore: number;
    homeTeamId: number;
    awayTeamId: number;
}

enum LedMode {
    Off,
    Blink,
    //TODO
}