import express from "express";
import {DB} from "../database/data";
import {DevicesRepository} from "../repos/devices-repository";
import {StatusCodes} from "http-status-codes";
import {Device} from "../database/model";

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

devicesRouter.post("/", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        if (await DevicesRepository.deviceExists(req.body.macAddress as string, db)) {
            throw new Error("Device already exists");
        }

        let device: Device = {
            macAddress: req.body.macAddress as string,
            name: req.body.name as string,
        };
        device = await DevicesRepository.addDevice(device, db);

        res.send(device);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(`Bad request: ${error}`);
    } finally {
        await db.close();
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

// @ts-ignore
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
