import {Device, Game, Player, Team, User} from "./model";
import bcrypt from "bcrypt";

const saltRounds = 8;

export const users: User[] = [{
    firstName: "System",
    lastName: "Admin",
    isAdmin: true,
    username: "admin",
    password: bcrypt.hashSync("pw4admin", saltRounds),
}, {
    firstName: "John",
    lastName: "Doe",
    isAdmin: false,
    username: "john-doe",
    password: bcrypt.hashSync("pw4user", saltRounds),
},];

export const goalfinders: Device[] = [
    { macAddress: "00:1A:7D:DA:71:13", name: "GoalFinder Alpha" },
    { macAddress: "00:1A:7D:DA:71:14", name: "GoalFinder Beta" },
    { macAddress: "00:1A:7D:DA:71:15", name: "GoalFinder Gamma" },
    { macAddress: "00:1A:7D:DA:71:16", name: "GoalFinder Delta" },
    { macAddress: "00:1A:7D:DA:71:17", name: "GoalFinder Epsilon" },
    { macAddress: "00:1A:7D:DA:71:18", name: "GoalFinder Zeta" },
    { macAddress: "00:1A:7D:DA:71:19", name: "GoalFinder Eta" },
    { macAddress: "00:1A:7D:DA:71:1A", name: "GoalFinder Theta" },
    { macAddress: "00:1A:7D:DA:71:1B", name: "GoalFinder Iota" },
    { macAddress: "00:1A:7D:DA:71:1C", name: "GoalFinder Kappa" },
    { macAddress: "00:1A:7D:DA:71:1D", name: "GoalFinder Lambda" },
];

export const players: Player[] = [
    { id: 1, name: "Alice Anderson" },
    { id: 2, name: "Bob Brown" },
    { id: 3, name: "Charlie Clark" },
    { id: 4, name: "Dana Davis" },
    { id: 5, name: "Evan Edwards" },
    { id: 6, name: "Fiona Fox" },
    { id: 7, name: "George Green" },
    { id: 8, name: "Hannah Hill" },
    { id: 9, name: "Ian Irwin" },
    { id: 10, name: "Jenna Jones" },
    { id: 11, name: "Kyle King" },
    { id: 12, name: "Lily Lane" },
    { id: 13, name: "Mike Miller" },
    { id: 14, name: "Nina Novak" },
];

export const teams: Team[] = [
    { id: 1, name: "Red Hawks" },
    { id: 2, name: "Blue Bears" },
    { id: 3, name: "Green Gators" },
    { id: 4, name: "Yellow Yetis" },
    { id: 5, name: "Purple Panthers" },
    { id: 6, name: "Orange Owls" },
    { id: 7, name: "Silver Sharks" },
    { id: 8, name: "Golden Goats" },
    { id: 9, name: "Black Bats" },
    { id: 10, name: "White Wolves" },
    { id: 11, name: "Bronze Bison" },
    { id: 12, name: "Crimson Coyotes" },
];

export const teamsPlayers = [
    { id: 1, teamId: 1, playerId: 1 },
    { id: 2, teamId: 1, playerId: 2 },
    { id: 3, teamId: 2, playerId: 3 },
    { id: 4, teamId: 2, playerId: 4 },
    { id: 5, teamId: 3, playerId: 5 },
    { id: 6, teamId: 3, playerId: 6 },
    { id: 7, teamId: 4, playerId: 7 },
    { id: 8, teamId: 4, playerId: 8 },
    { id: 9, teamId: 5, playerId: 9 },
    { id: 10, teamId: 5, playerId: 10 },
    { id: 11, teamId: 6, playerId: 11 },
    { id: 12, teamId: 6, playerId: 12 },
    { id: 13, teamId: 7, playerId: 13 },
    { id: 14, teamId: 7, playerId: 14 },
];

export const games = [
    {
        id: 1,
        date: new Date("2025-05-10T14:00:00Z"),
        homeTeamScore: 3,
        awayTeamScore: 2,
        homeTeamId: 1,
        awayTeamId: 2,
    },
    {
        id: 2,
        date: new Date("2025-05-12T16:30:00Z"),
        homeTeamScore: 1,
        awayTeamScore: 1,
        homeTeamId: 2,
        awayTeamId: 1,
    },
    {
        id: 3,
        date: new Date("2025-05-14T13:00:00Z"),
        homeTeamScore: 2,
        awayTeamScore: 0,
        homeTeamId: 3,
        awayTeamId: 4,
    },
    {
        id: 4,
        date: new Date("2025-05-15T15:00:00Z"),
        homeTeamScore: 4,
        awayTeamScore: 1,
        homeTeamId: 5,
        awayTeamId: 6,
    },
    {
        id: 5,
        date: new Date("2025-05-16T18:00:00Z"),
        homeTeamScore: 0,
        awayTeamScore: 3,
        homeTeamId: 7,
        awayTeamId: 8,
    },
    {
        id: 6,
        date: new Date("2025-05-17T17:00:00Z"),
        homeTeamScore: 3,
        awayTeamScore: 3,
        homeTeamId: 9,
        awayTeamId: 10,
    },
    {
        id: 7,
        date: new Date("2025-05-18T11:00:00Z"),
        homeTeamScore: 2,
        awayTeamScore: 1,
        homeTeamId: 11,
        awayTeamId: 12,
    },
    {
        id: 8,
        date: new Date("2025-05-19T14:30:00Z"),
        homeTeamScore: 1,
        awayTeamScore: 2,
        homeTeamId: 3,
        awayTeamId: 5,
    },
    {
        id: 9,
        date: new Date("2025-05-20T13:45:00Z"),
        homeTeamScore: 0,
        awayTeamScore: 1,
        homeTeamId: 6,
        awayTeamId: 8,
    },
    {
        id: 10,
        date: new Date("2025-05-21T12:00:00Z"),
        homeTeamScore: 5,
        awayTeamScore: 2,
        homeTeamId: 4,
        awayTeamId: 7,
    },
    {
        id: 11,
        date: new Date("2025-05-22T16:00:00Z"),
        homeTeamScore: 2,
        awayTeamScore: 2,
        homeTeamId: 9,
        awayTeamId: 11,
    },
];
