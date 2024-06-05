import { ApiError } from "../../util/ApiError.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { AsyncHandler } from "../../util/AsyncHandler.js";
import { Contest } from "../../model/Contest.model.js";
import { Result } from "../../model/Answer.model.js";
import { User } from "../../model/User.model.js";
import { sendDeclaredResult } from "../mail.controller.js";
import { Question } from "../../model/Question.model.js";

export const GetAllContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized Access");
        }
        if (!req.user.type === "admin"){
            throw new ApiError(403, "Access Forbidden");
        }

        const data = {};

        if ("active" in req.query) {
            data.active = req.query.active;
        }

        if (req?.query?.past === "true") {
            data.endDate = {$lt: new Date().toLocaleString()};
        } else {
            data.endDate = {$gt: new Date().toLocaleString()};
        }

        const contests = await Contest.find({...data});

        if (!contests){
            throw new ApiError(404, "No Contests Found");
        }

        const results = [...contests];

        for (let i = 0; i < contests.length; i++) {
            const temp = await Result.countDocuments({contestId: contests[i]._id, declared: false});
            results[i].unEvaluated = temp;
        }

        return res.json(new ApiResponse(200, results, "All Contests Listed"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const GetResultsForContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized Access");
        }
        if (!req.user.type === "admin"){
            throw new ApiError(403, "Access Forbidden");
        }

        const contest = await Contest.findById(req.params.id);
        if (!contest){
            throw new ApiError(404, "Contest Not Found");
        }

        const results = await Result.find({contestId: contest._id, declared: true}).populate("userId").select("-answers");

        if (!results){
            throw new ApiError(404, "No Results Found");
        }

        return res.json(new ApiResponse(200, results, "Results Listed"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
});

export const DeclareResultForContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user){
            throw new ApiError(401, "Unauthorized Access");
        }
        if (!req.user.type === "admin"){
            throw new ApiError(403, "Access Forbidden");
        }

        const contest = await Contest.findById(req.params.id);

        if (!contest){
            throw new ApiError(404, "Contest Not Found");
        }

        if (!contest.active){
            throw new ApiError(400, "Contest Not Active");
        }

        if (contest.endDate > new Date().toLocaleString()){
            throw new ApiError(400, "Contest Not Ended");
        }

        const results = await Result.find({contestId: contest._id, declared: false});

        if (!results){
            throw new ApiError(404, "No Results Found");
        }

        if (results.declared){
            throw new ApiError(400, "Results Already Declared");
        }

        results.forEach(async (result) => {
            let total = 0;
            result.answers.forEach(async (answer) => {
                const question = await Question.findById(answer.questionId);
                if (question.type === "multiple"){
                    let res = true;
                    question.multipleAnswer.forEach((ans, index) => {
                        if (ans?.toLowerCase() !== answer.answer[index]?.toLowerCase()){
                            res = false;
                        }
                    });
                    if (res){
                        total += question.marks;
                    }
                    // else {
                    //     total -= question.marks;
                    // }
                } else {
                    if (question.answer === answer.answer[0]){
                        total += question.marks;
                    }
                    // else {
                    //     totl -= question.marks;
                    // }
                }
                answer.marks = question.marks;
            });
            result.totalMarks = total;
            result.declared = true;
            await result.save();
        })

        contest.declared = true;
        await contest.save();

        return res.json(new ApiResponse(200, {}, "Results Declared"));
    } catch (err) {
        throw new ApiError(500, err.message);
    }
})