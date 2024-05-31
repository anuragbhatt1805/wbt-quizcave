import mongoose from "mongoose";


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
    active: {
        type: Boolean,
        default: false
    },
    registration: {
        type: Boolean,
        default: true
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
    },
    declared: {
        type: Boolean,
        default: false
    },
    passingMarks: {
        type: Number
    }
}, {
    timestamps: true
});

export const Contest = mongoose.model('Contest', ContestSchema);