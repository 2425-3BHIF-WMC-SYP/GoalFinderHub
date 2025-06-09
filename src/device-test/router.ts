import express from "express";
import {StatusCodes} from "http-status-codes";

export const router = express.Router();

let started: boolean = false;

router.post("/start", (req, res) => {
   started = true;
   res.sendStatus(StatusCodes.NOT_FOUND);
});

router.post("/stop", (req, res) => {
   started = false;
   res.sendStatus(StatusCodes.NOT_FOUND);
});

router.get("/status", (req, res) => {
   res.send(started ? "started" : "stopped");
})