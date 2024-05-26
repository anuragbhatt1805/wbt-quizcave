import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { AsyncHandler } from "../util/AsyncHandler.js";
import { Contest } from "../model/Contest.model.js";
import { Result } from "../model/Answer.model.js"

export const GetAllContests = AsyncHandler(async (req, res) => {
    try{
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const contests = await Contest.find({active: true, endDate: {$gt: new Date()}})
            .select("-questions -registered -participants -createdBy -updatedAt -__v")
            .sort({startDate: -1});

        return res.json(new ApiResponse(200, contests, "Currently Available Contests Listed"));
    } catch(err) {
        throw new ApiError(500, err.message);
    }
});

export const GetContestById = AsyncHandler(async (req, res) => {
    try{
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const contest = await Contest.findById(req.params.id)
            .select("-participants -createdBy -updatedAt -__v -questions")
            .populate("registered", "name email userId");

        if (!contest) {
            throw new ApiError(404, "Contest Not Found");
        }

        return res.json(new ApiResponse(200, contest, "Contest Details"));
    } catch(err) {
        throw new ApiError(500, err.message);
    }
});

export const RegisterForContest = AsyncHandler(async (req, res) => {
    try{
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest Not Found");
        }

        if (!contest.registration) {
            throw new ApiError(400, "Registration Closed");
        }

        if (contest.registered.includes(req.user._id)) {
            throw new ApiError(400, "Already Registered");
        }

        contest.registered.push(req.user._id);
        await contest.save();

        return res.json(new ApiResponse(200, {}, "Successfully Registered"));
    } catch(err) {
        throw new ApiError(500, err.message);
    }
});

export const UnregisterFromContest = AsyncHandler(async (req, res) => {
    try{
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest Not Found");
        }

        if (!contest.registration) {
            throw new ApiError(400, "Cannot Unregister Currently");
        }

        if (!contest.registered.includes(req.user._id)) {
            throw new ApiError(400, "Not Registered");
        }

        contest.registered = contest.registered.remove(req.user._id);
        await contest.save();

        return res.json(new ApiResponse(200, {}, "Successfully Unregistered"));
    } catch(err) {
        throw new ApiError(500, err.message);
    }
});

export const AttemptContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest Not Found");
        }

        if (!contest.active) {
            throw new ApiError(400, "Contest Not Active");
        }

        if (!contest.registered.includes(req.user._id)) {
            throw new ApiError(400, "Not Registered for Contest");
        }

        contest.participants.push(req.user._id);
        await contest.save();

        const result = new Result({
            contestId: contest._id,
            userId: req.user._id,
        });

        await result.save();

        return res.json(new ApiResponse(200, {
            contest: contest,
            result: result
        }, "Contest Started"));
    } catch(err) {
        throw new ApiError(500, err.message);
    }
});
