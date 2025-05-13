import express from "express";
import {DB} from "../database/data";
import {DevicesRepository} from "../database/devices-repository";
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
        if(await DevicesRepository.deviceExists(req.body.macAddress as string, db)) {
           throw new Error("Device already exists");
        }

        let device = new Device(req.body.macAddress as string, req.body.name as string);
        device = await DevicesRepository.addDevice(device, db);

        res.send(device);
    }
    catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(`Bad request: ${error}`);
    }
    finally {
        await db.close();
    }
});

devicesRouter.delete("/:macAddress", async (req, res) => {
    const db = await DB.createDBConnection();

    try {
        let macAddress = req.params.macAddress as string;
        macAddress = await DevicesRepository.deleteDevice(macAddress, db);

        res.status(StatusCodes.OK).send(`Device with macAdress: ${macAddress} is deleted`);
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
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name must be provided.' });
    }

    try {
        if (!await DevicesRepository.deviceExists(oldMacAddress, db)) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        await DevicesRepository.updateDevice(oldMacAddress, db, name);
        return res.status(200).json({ message: 'Device updated successfully.' });
    } catch (error) {
        console.error('Update failed:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await db.close();
    }
});
