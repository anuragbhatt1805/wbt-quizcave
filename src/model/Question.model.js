
const QuestionSchema = new mongoose.Schema({
    set: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D', 'E']
    },
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

const Question = mongoose.model('Question', QuestionSchema);