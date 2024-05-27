import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}))

app.use(express.json({"limit":"64kb"}));
app.use(express.urlencoded({ extended: true, limit: "10000kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes for the app
import { AdminUserRouter } from './routes/admin/user.routes.js';
import { AdminContestRouter } from "./routes/admin/contest.routes.js";
import { ContestRouter } from "./routes/contest.routes.js";
import { UserRouter } from "./routes/user.routes.js";

app.use("/api/v1/admin/user", AdminUserRouter);
app.use("/api/v1/admin/contest", AdminContestRouter);

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/contest", ContestRouter);