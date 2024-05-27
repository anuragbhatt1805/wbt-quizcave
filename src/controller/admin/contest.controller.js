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

export const UpdateContest = AsyncHandler(async (req, res) => {
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

        if ("name" in req.body) {
            contest.name = req?.body?.name.trim();
        }
        if ("description" in req.body) {
            contest.description = req?.body?.description;
        }
        if ("duration" in req.body) {
            contest.duration = Number(req?.body?.duration);
        }
        if ("rules" in req.body) {
            contest.rules = req?.body?.rules;
        }
        if ("startDate" in req.body) {
            contest.startDate = new Date(req?.body?.startDate);
        }
        if ("endDate" in req.body) {
            contest.endDate = new Date(req?.body?.endDate);
        }
        if ("active" in req.body) {
            contest.active = req?.body?.active ? req?.body?.active : false;
        }
        if ("passingMarks" in req.body) {
            contest.passingMarks = Number(req?.body?.passingMarks);
        }
        if ("registration" in req.body) {
            contest.registration = req?.body?.registration ? req?.body?.registration : false;
        }

        await contest.save();

        return res.status(200).json(new ApiResponse(200, contest, "Contest updated successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

export const RemoveContest = AsyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized Access");
        }

        if (req.user.role !== "admin") {
            throw new ApiError(401, "Unauthorized Access");
        }

        const contest = await Contest.findByIdAndDelete(req.params.id);

        if (!contest) {
            throw new ApiError(404, "Contest not found");
        }

        return res.status(200).json(new ApiResponse(200, contest, "Contest removed successfully"));
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

        if (req?.files && req.files.length > 0 && req?.files?.questionImage?.length > 0) {
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

export const UpdateQuestion = AsyncHandler(async (req, res) => {
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

        const questionInfo = contest.questions.id(req.params.questionId);

        if (!questionInfo) {
            throw new ApiError(404, "Question not found");
        }

        if ("question" in req.body) {
            questionInfo.question = req?.body?.question;
        }
        if ("type" in req.body) {
            questionInfo.type = req?.body?.type;
        }
        if ("marks" in req.body) {
            questionInfo.marks = req?.body?.marks;
        }

        if (type === "multiple") {
            questionInfo.multipleQuestion = req?.body?.multipleQuestion;
            questionInfo.multipleAnswer = req?.body?.multipleAnswer;
        } else {
            questionInfo.singleAnswer = req?.body?.singleAnswer;
        }

        if (type === "mcq") {
            questionInfo.mcqOptions = req?.body?.options || req?.body?.mcqOptions;
        }

        if ("questionImage" in req.file) {
            if (questionInfo.questionImage) {
                const imagePath = path.join("public", question.questionImage);
                await fs.unlinkSync(imagePath);
            }
            questionInfo.questionImage = path.join("uploads", path.basename(req?.file?.questionImage[0]?.path));
        }

        await contest.save();

        return res.status(200).json(new ApiResponse(200, question, "Question updated successfully"));
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