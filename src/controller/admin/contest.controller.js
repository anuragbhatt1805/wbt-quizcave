import { ApiError } from "../../util/ApiError.js";
import { ApiResponse } from "../../util/ApiResponse.js";
import { AsyncHandler } from "../../util/AsyncHandler.js";
import { Contest } from "../../model/Contest.model.js";
import { User } from "../../model/User.model.js";
import path from "path";

export const CreateContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized Access");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(401, "Unauthorized Access");
        }

        const {
            name, description, duration, rules, startDate, endDate, active
        } = req.body;

        if (!name || !description || !duration || !rules || !startDate || !endDate) {
            throw new ApiError(400, "All fields are required");
        }

        const newContest = await Contest.create({
            name: name.trim(),
            description: description,
            duration: Number(duration),
            rules: rules,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            createdBy: req.user._id,
            active: active ? active : false
        })

        if (!newContest) {
            throw new ApiError(500, "Failed to create contest");
        }

        return res.status(201).json(new ApiResponse(201, newContest, "Contest created successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const AddQuestion = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized Access");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(401, "Unauthorized Access");
        }

        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest not found");
        }

        const {
            question, type, marks
        } = req.body;

        if (!question || !type || !marks) {
            throw new ApiError(400, "All fields are required");
        }

        const data = {
            question: question,
            type: type,
            marks: marks,
        }

        if (type === "multiple") {
            data.multipleQuestion = req.body.multipleQuestion;
            data.multipleAnswer = req.body.multipleAnswer;
        } else {
            data.singleAnswer = req.body.singleAnswer;
        }

        if (type === "mcq") {
            data.mcqOptions = req.body.options || req.body.mcqOptions;
        }

        if ("questionImage" in req.file) {
            data.questionImage = path.join("uploads", path.basename(req?.file?.questionImage[0]?.path));
        }

        contest.questions.push(data);
        await contest.save();

        const addedQuestion = contest.questions[contest.questions.length - 1];

        return res.status(201).json(new ApiResponse(201, addedQuestion, "Question added successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const RemoveQuestion = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized Access");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(401, "Unauthorized Access");
        }

        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest not found");
        }

        const question = contest.questions.id(req.params.questionId);

        if (!question) {
            throw new ApiError(404, "Question not found");
        }

        if (question.questionImage) {
            const imagePath = path.join("public", question.questionImage);
            await fs.unlinkSync(imagePath);
        }

        question.remove();
        await contest.save();

        return res.status(200).json(new ApiResponse(200, contest.questions, "Question removed successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const GetContest = AsyncHandler(async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest not found");
        }

        return res.status(200).json(new ApiResponse(200, contest, "Contest details"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const GetContests = AsyncHandler(async (req, res) => {
    try {
        const query = {};
        if ("active" in req.query) {
            query.active = req.query.active;
        }
        const contests = await Contest.find(query);

        if (!contests) {
            throw new ApiError(404, "No contests found");
        }

        return res.status(200).json(new ApiResponse(200, contests, "All contests"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});