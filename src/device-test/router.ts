import express from "express";

export const router = express.Router();

let started: boolean = false;

router.post("/start", (req, res) => {
   started = true;
   res.sendStatus(200);
});

router.post("/stop", (req, res) => {
   started = false;
   res.sendStatus(200);
});

router.get("/status", (req, res) => {
   res.send(started ? "started" : "stopped");
})