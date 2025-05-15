create table if not exists GAMES
(
    id               INTEGER
        constraint gamesPk
            primary key,
    date             TEXT,
    homeTeamScore    INTEGER,
    awayTeamScore    INTEGER,
    homeTeamId       INTEGER,
        -- constraint gamesTeamsIdFk
           -- references TEAMS,
    awayTeamId       INTEGER
        -- constraint gamesTeamsIdFk2
           -- references TEAMS
);

create table if not exists GOALFINDERS
(
    macAddress TEXT not null
        constraint goalfindersPk
            primary key,
    name       TEXT not null
);

create table if not exists PLAYERS
(
    id   INTEGER
        constraint playersPk
            primary key autoincrement,
    name TEXT
);

create table if not exists TEAMS
(
    id   INTEGER
        constraint teamsPk
            primary key autoincrement,
    name INTEGER not null
);

create table if not exists TEAMS_PLAYERS
(
    id       INTEGER not null
        constraint teamsPlayersPk
            primary key autoincrement,
    teamId   INTEGER
        constraint teamsPlayersTeamsIdFk
            references TEAMS,
    playerId INTEGER
        constraint teamsPlayersPlayersIdFk
            references PLAYERS
);

create table if not exists USERS
(
    username  TEXT    not null
        constraint usersPk
            primary key,
    password  TEXT    not null,
    firstName TEXT    not null,
    lastName  TEXT    not null,
    isAdmin   INTEGER not null check ( isAdmin in (0, 1))
);
