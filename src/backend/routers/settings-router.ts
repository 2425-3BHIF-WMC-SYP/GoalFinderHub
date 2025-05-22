import express from "express";
import {StatusCodes} from "http-status-codes";
import {Settings} from "../settings";

export const settingsRouter = express.Router();

settingsRouter.get("/", (req, res) => {
    try {
        const settings = {
            macAddress: Settings.getInstance().macAddress,
            ipAddress: Settings.getInstance().ipAddress
        }

        res.send(settings);
    }
    catch (error) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
});