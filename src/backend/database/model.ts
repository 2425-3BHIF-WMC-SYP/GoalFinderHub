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
    isActive?: boolean;
    ipAddress?: string;
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
    duration: number;
    homeTeamScore: number;
    awayTeamScore: number;
    homeTeam: Team;
    awayTeam: Team;
    started: boolean;
}

enum LedMode {
    Off,
    Blink,
    //TODO
}