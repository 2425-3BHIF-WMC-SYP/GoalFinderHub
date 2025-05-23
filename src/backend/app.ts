// for installing all dependencies once run 'npm install'
// for starting the server run 'npm start'
// for starting the server in watchmode run 'npm run server-dev'

// import modules
import express from "express";
import cors from "cors";
import {Database} from "sqlite";
import {DB} from "./database/data";
import {devicesRouter} from "./routers/devices-router";
import {dropTables, ensureSampleDataInserted} from "./database/data-seeding";
import {authRouter} from "./routers/auth-router";
import dotenv from "dotenv";
import {teamsRouter} from "./routers/teams-router";
import {leaderboardRouter} from "./routers/leaderboard-router";
import {gamesRouter} from "./routers/game-router";
import { settingsRouter } from "./routers/settings-router";

const API_URL = "/api"

// create express application
const app = express();

dotenv.config();

// mount middleware
app.use(cors());
app.use(express.json());    // parse JSON data and place result in req.body

// mount router(s)
app.use(`${API_URL}/auth`, authRouter);
app.use(`${API_URL}/devices`, devicesRouter);
app.use(`${API_URL}/teams`, teamsRouter);
app.use(`${API_URL}/leaderboard`, leaderboardRouter);
app.use(`${API_URL}/games`, gamesRouter);
app.use(`${API_URL}/settings`, settingsRouter);

// ensure database is created and populated
const db: Database = await DB.createDBConnection();
await dropTables(db); //Only for testing
await DB.ensureTablesCreated(db); //moved from DB class for testing
await ensureSampleDataInserted(db); //Only for testing
await db.close();

// start http server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});