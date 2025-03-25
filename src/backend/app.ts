// for installing all dependencies once run 'npm install'
// for starting the server run 'npm start'
// for starting the server in watchmode run 'npm run server-dev'

// import modules
import express from "express";
import cors from "cors";
import { Database } from "sqlite";
import { DB } from "./database/data";
import {devicesRouter} from "./routers/devices-router";

const API_URL = "/api"

// create express application
const app = express();

// mount middleware
app.use(cors());
app.use(express.json());    // parse JSON data and place result in req.body

// mount router(s)
app.use(`${API_URL}/devices`, devicesRouter);
// TODO

// ensure database is created and populated
const db: Database = await DB.createDBConnection();
//TODO await ensureSampleDataInserted(db);
await db.close();

// start http server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});