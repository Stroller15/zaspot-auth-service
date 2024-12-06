import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to auth service");
});

import authRouter from "./routes/auth.route";
app.use("/auth", authRouter);

//*** golbal error handling

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        errors: [{ type: err.name, msg: err.message, path: "", location: "" }],
    });
});

export default app;
