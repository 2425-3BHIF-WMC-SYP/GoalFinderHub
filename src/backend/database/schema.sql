create table GAMES
(
    Id             INTEGER
        constraint GAMES_pk
            primary key,
    Date           TEXT,
    HomeTeamScore  INTEGER,
    AwayTeamScore  INTEGER,
    HomeTeam       INTEGER
        constraint GAMES_TEAMS_Id_fk
            references TEAMS,
    AwayTeam       INTEGER
        constraint GAMES_TEAMS_Id_fk_2
            references TEAMS,
    HomeGoalfinder TEXT not null
        constraint GAMES_GOALFINDERS_MacAddress_fk
            references GOALFINDERS,
    AwayGoalfinder TEXT not null
        constraint GAMES_GOALFINDERS_MacAddress_fk_2
            references GOALFINDERS
);

create table GOALFINDERS
(
    MacAddress TEXT not null
        constraint GOALFINDERS_pk
            primary key,
    Name       TEXT not null
);

create table LEADERBOARDS
(
    Id    INTEGER not null
        constraint LEADERBOARD_pk
            primary key autoincrement
        constraint LEADERBOARDS_LEADERBOARDS_TEAMS_LeaderBoardId_fk
            references LEADERBOARDS_TEAMS (LeaderBoardId),
    Teams INT     not null
);

create table LEADERBOARDS_TEAMS
(
    Id            INTEGER
        constraint LEADERBOARDS_TEAMS_pk
            primary key,
    LeaderBoardId INTEGER not null
        constraint LEADERBOARDS_TEAMS_LEADERBOARDS_Id_fk
            references LEADERBOARDS,
    TeamId        integer not null
        constraint LEADERBOARDS_TEAMS_TEAMS_Id_fk
            references TEAMS
);

create table PLAYERS
(
    Id   INTEGER
        constraint PLAYERS_pk
            primary key autoincrement,
    Name TEXT
);

create table TEAMS
(
    Id      INTEGER not null
        constraint TEAMS_pk
            primary key autoincrement
        constraint TEAMS_TEAMS_PLAYERS_TeamId_fk
            references TEAMS_PLAYERS (TeamId),
    Name    INTEGER not null,
    Players INTEGER not null
);

create table TEAMS_PLAYERS
(
    Id       INTEGER not null
        constraint TEAMS_PLAYERS_pk
            primary key autoincrement,
    TeamId   INTEGER
        constraint TEAMS_PLAYERS_TEAMS_Id_fk
            references TEAMS,
    PlayerId INTEGER
        constraint TEAMS_PLAYERS_PLAYERS_Id_fk
            references PLAYERS
);