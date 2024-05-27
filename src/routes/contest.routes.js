import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { 
    GetAllContests, GetContestById, AttemptContest,
    RegisterForContest, UnregisterFromContest
} from "../controller/contest.controller.js";

export const ContestRouter = Router();

ContestRouter.get("/all", auth, GetAllContests);
ContestRouter.get("/:id", auth, GetContestById);
ContestRouter.post("/register/:id", auth, RegisterForContest);
ContestRouter.post("/unregister/:id", auth, UnregisterFromContest);
ContestRouter.post("/attempt/:id", auth, AttemptContest);