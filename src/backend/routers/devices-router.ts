import express from "express";
import {DB} from "../database/data";
import {DevicesRepository} from "../database/devices-repository";
import {StatusCodes} from "http-status-codes";

export const devicesRouter = express.Router();

devicesRouter.get("/", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        const devices = await DevicesRepository.getAllDevices(db);

        res.send(devices);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(`Bad request: ${error}`);
    } finally {
        await db.close();
    }
});



