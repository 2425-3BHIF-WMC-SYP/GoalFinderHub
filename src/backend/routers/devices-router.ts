import express from "express";
import {StatusCodes} from "http-status-codes";
import {DeviceManager} from "../devices/device-manager";

export const devicesRouter = express.Router();
const deviceManager = DeviceManager.getInstance();

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
    try {
        await deviceManager.deleteDevice(req.params.macAddress);
        res.sendStatus(StatusCodes.NO_CONTENT);
    }
    catch (error) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

devicesRouter.put('/:macAddress', async (req, res) => {
    if(!req.body.name) {
        res.status(StatusCodes.BAD_REQUEST).send("Missing input");
        return;
    }

    const device = deviceManager.getDevice(req.params.macAddress);

    if(!device) {
        res.status(StatusCodes.BAD_REQUEST).send("Device does not exist!");
        return;
    }

    device.name = req.body.name;
    await deviceManager.saveDevice(device);

    res.send(device);
});
