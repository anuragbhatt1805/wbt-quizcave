import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import {
    CreateContest, AddQuestion, GetContest, GetContests,
    RemoveQuestion
} from "../../controller/admin/contest.controller.js";

export const AdminContestRouter = Router();

AdminContestRouter.get("/all", auth, GetContests);
AdminContestRouter.get("/:id", auth, GetContest);


AdminContestRouter.post("/create", auth, CreateContest);
AdminContestRouter.post("/add-question/:id", auth, upload.fields([
    { name: "questionImage", maxCount: 1 },
]), AddQuestion);
AdminContestRouter.delete("/remove-question/:id/:questionId", auth, RemoveQuestion);