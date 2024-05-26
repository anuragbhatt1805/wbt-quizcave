import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    questionImage: {
        type: String
    },
    type: {
        type: String,
        required: true,
        enum: ['mcq', 'short', 'long', 'numerical', 'multiple']
    },
    mcqOptions: {
        type: [String]
    },
    answer: {
        type: String
    },
    multipleQuestion: {
        type: [String]
    },
    multipleAnswer: {
        type: [String]
    },
    marks: {
        type: Number,
        required: true
    }
});

const ContestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    duration:{
        type: Number,
        required: true
    },
    rules: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    questions: {
        type: [QuestionSchema]
    },
    active: {
        type: Boolean,
        default: false
    },
    registration: {
        type: Boolean,
        default: false
    },
    registered: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

export const Contest = mongoose.model('Contest', ContestSchema);