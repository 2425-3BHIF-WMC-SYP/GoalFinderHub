import express from "express";
import {router} from "./router";
import cors from "cors";

const app = express();
app.use(express.json())
app.use(cors());
app.use("/api", router);

// start http server
app.listen(80, () => {
    console.log("Server listening on port 80");
});