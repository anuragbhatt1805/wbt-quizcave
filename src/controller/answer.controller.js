import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { AsyncHandler } from "../util/AsyncHandler.js";
import { Result } from "../model/Answer.model.js";
import { Contest } from "../model/Contest.model.js";

export const GetAllDeclaredResult = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const results = await Result.find({ declared: true, userId: req.user._id})
            .populate("contestId", "name");

        if (!results) {
            throw new ApiError(404, "No declared results found");
        }

        return res.json(new ApiResponse(200, results, "Declared Results Listed"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const GetResultById = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const result = await Result.findOne({ _id: req.params.id, userId: req.user._id, declared: true })
            .populate("contestId", "name");

        if (!result) {
            throw new ApiError(404, "Result not found");
        }

        return res.json(new ApiResponse(200, result, "Result Found"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const AddAnswerInResult = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        console.log(req.params);
        console.log("================================================");
        console.log(req);
        console.log("================================================");
        console.log(req?.body);


        const result = await Result.findOne({ _id: req.params.id, userId: req.user._id });

        if (!result) {
            throw new ApiError(404, "Result not found");
        }

        console.log("==========================1");

        if (result.sumbittedOn !== undefined) {
            throw new ApiError(400, "Result Already Submitted");
        }

        console.log("==========================2");

        const {question, answer} = req.body;

        const contest = await Contest.findById(result.contestId);

        console.log("==========================3");

        const questionInfo = contest.questions.find(q => q._id == question);
        // const questionInfo = contest.questions.filter(q => q._id == question)[0];

        if (!questionInfo) {
            throw new ApiError(404, "Question not found");
        }

        console.log("==========================4");

        const data = {
            questionId: question,
        };

        if (result.answers.find(a => a.questionId == question)) {
            throw new ApiError(400, "Question Already Answered");
        }

        console.log("==========================5");

        if (questionInfo.type === "multiple"){
            data.answer = answer;
        } else {
            data.answer = [answer];
        }

        console.log("==========================6");

        result.answers.push(data);
        await result.save();

        console.log("==========================7");

        return res.status(201).json(new ApiResponse(201, {}, "Answer Saved Successfully"));
    } catch (err) {
        console.log(err)
        throw new ApiError(500, err.message);
    }
});

export const SumbitResult = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        const result = await Result.findOne({ _id: req.params.id, userId: req.user._id });
        const contest = await Contest.findOne({ _id: result.contestId });

        if (!result) {
            throw new ApiError(404, "Result not found");
        }

        result.sumbittedOn = new Date();
        result.timeTaken = (result.sumbittedOn - contest.startDate) / 1000;
        await result.save();

        return res.status(201).json(new ApiResponse(201, {}, "All answers submittd Successfully"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});