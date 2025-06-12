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

export enum LedMode {
    Standard = 1,
    Fade,
    Flash,
    Turbo,
    Off
}

export interface Device {
    macAddress: string;
    ipAddress?: string;
    isActive: boolean;
    name: string;
    volume: number;
    ledMode: LedMode;
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
    homeDevice: Device;
    awayDevice: Device;
}