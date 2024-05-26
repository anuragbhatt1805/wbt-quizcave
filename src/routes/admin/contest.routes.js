import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import {
    CreateContest, AddQuestion, GetContest, GetContests,
    RemoveQuestion, RemoveContest, UpdateContest, UpdateQuestion
} from "../../controller/admin/contest.controller.js";

export const AdminContestRouter = Router();

AdminContestRouter.get("/all", auth, GetContests);
AdminContestRouter.get("/:id", auth, GetContest);
AdminContestRouter.post("/create", auth, CreateContest);
AdminContestRouter.put("/update/:id", auth, UpdateContest);
AdminContestRouter.delete("/remove/:id", auth, RemoveContest);

AdminContestRouter.post("/add-question/:id", auth, upload.fields([
    { name: "questionImage", maxCount: 1 },
]), AddQuestion);
AdminContestRouter.put("/update-question/:id/:questionId", auth, upload.fields([
    { name: "questionImage", maxCount: 1 },
]), UpdateQuestion);
AdminContestRouter.delete("/remove-question/:id/:questionId", auth, RemoveQuestion);