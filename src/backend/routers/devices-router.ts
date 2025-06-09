import express from "express";
import {DB} from "../database/data";
import {DevicesRepository} from "../repos/devices-repository";
import {StatusCodes} from "http-status-codes";
import {DeviceManager} from "../devices/device-manager";

export const devicesRouter = express.Router();
const deviceManager = new DeviceManager();
await deviceManager.loadDevices();

devicesRouter.get("/", async (req, res) => {
    res.send(deviceManager.getAllDevices());
});

devicesRouter.post("/", async (req, res) => {
    if(!req.body.macAddress || !req.body.ipAddress) {
        res.status(StatusCodes.BAD_REQUEST).send("Missing input");
        return;
    }

    try {
        await deviceManager.registerDevice(req.body.macAddress, req.body.ipAddress);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
    catch (error) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

devicesRouter.delete("/:macAddress", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        let macAddress = req.params.macAddress as string;
        await DevicesRepository.deleteDevice(macAddress, db);

        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(`Bad request: ${error}`);
    } finally {
        await db.close();
    }
});

devicesRouter.put('/:macAddress', async (req, res) => {
    const db = await DB.createDBConnection();
    const oldMacAddress = req.params.macAddress;
    const {name} = req.body;

    if (!name) {
        //Name must be provided
        res.status(StatusCodes.BAD_REQUEST).send("Name must be provided");
        return;
    }

    try {
        if (!await DevicesRepository.deviceExists(oldMacAddress, db)) {
            res.status(StatusCodes.BAD_REQUEST).send('Device not found.');
            return;
        }

        await DevicesRepository.updateDevice(oldMacAddress, db, name);
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
        console.error('Update failed:', error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await db.close();
    }
});
