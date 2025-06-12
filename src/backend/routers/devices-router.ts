import express from "express";
import {StatusCodes} from "http-status-codes";
import {DeviceManager} from "../devices/device-manager";

export const devicesRouter = express.Router();
const deviceManager = DeviceManager.getInstance();

devicesRouter.get("/", async (req, res) => {
    res.send(deviceManager.getAllDevices());
});

devicesRouter.post("/", async (req, res) => {
    if (!req.body.macAddress || !req.body.ipAddress) {
        res.status(StatusCodes.BAD_REQUEST).send("Missing input");
        return;
    }

    try {
        if (req.body.volume && req.body.ledMode) {
            await deviceManager.registerDevice(req.body.macAddress, req.body.ipAddress, Number(req.body.volume), req.body.ledMode);
        } else {
            await deviceManager.registerDevice(req.body.macAddress, req.body.ipAddress);
        }

        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

devicesRouter.delete("/:macAddress", async (req, res) => {
    try {
        await deviceManager.deleteDevice(req.params.macAddress);
        res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

devicesRouter.put('/:macAddress', async (req, res) => {
    if (!req.body.name) {
        res.status(StatusCodes.BAD_REQUEST).send("Missing input");
        return;
    }

    try {
        const device = deviceManager.getDevice(req.params.macAddress);

        if (device) {
            device.name = req.body.name ?? device.name;
            device.volume = req.body.volume ?? device.volume;
            device.ledMode = req.body.ledMode ?? device.ledMode;
            res.status(StatusCodes.NO_CONTENT).send();

        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        }
    } catch (error) {
    }
});
