import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}))

app.use(express.json({"limit":"6000kb"}));
app.use(express.urlencoded({ extended: true, limit: "10000kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes for the app
import { AdminUserRouter } from './routes/admin/user.routes.js';
import { AdminContestRouter } from "./routes/admin/contest.routes.js";
import { AdminResultRouter } from './routes/admin/answer.routes.js';
import { AdminQuestionRouter } from './routes/admin/question.routes.js';

import { ContestRouter } from "./routes/contest.routes.js";
import { UserRouter } from "./routes/user.routes.js";
import { ResultRouter } from './routes/result.routes.js';

app.use("/api/v1/admin/user", AdminUserRouter);
app.use("/api/v1/admin/contest", AdminContestRouter);
app.use("/api/v1/admin/result", AdminResultRouter);
app.use("/api/v1/admin/question", AdminQuestionRouter);

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/contest", ContestRouter);
app.use("/api/v1/result", ResultRouter);