const { QuestionLoader } = require("./QuestionLoader");
const fs = require("fs");
const { SingleAnswerStrategy } = require("./strategies/SingleAnswerStrategy");
const {
    MultipleChoiceStrategy,
} = require("./strategies/MultipleChoiceStrategy");
const {
    MultipleCorrectAnswersStrategy,
} = require("./strategies/MultipleCorrectAnswersStrategy");
const { Question } = require("./Question");

jest.mock("fs");

describe("QuestionLoader", () => {
    test("loads questions from file", async () => {
        fs.readFile = jest.fn((file, options, callback) => {
            callback(
                null,
                `
{"questions": [
    {"text": "foo", "choices": ["bar", "baz"], "strategy": {"type": "single", "correctAnswers": [1]}},
    {"text": "bar", "choices": ["foo", "fop"], "strategy": {"type": "multiple", "correctAnswers": [2]}},
    {"text": "bar", "choices": ["foo", "fop"], "strategy": {"type": "multiple_correct", "correctAnswers": [2]}}
]}`
            );
        });

        const questionLoader = new QuestionLoader();
        const questions = await questionLoader.loadQuiz(
            `${__dirname}/data/quiz-questions.json`
        );
        expect(fs.readFile).toHaveBeenCalled();
        expect(questions).toStrictEqual([
            new Question("foo", ["bar", "baz"], new SingleAnswerStrategy([1])),
            new Question(
                "bar",
                ["foo", "fop"],
                new MultipleChoiceStrategy([2])
            ),
            new Question(
                "bar",
                ["foo", "fop"],
                new MultipleCorrectAnswersStrategy([2])
            ),
        ]);
    });

    test("throws if strategy type is not valid", async () => {
        fs.readFile = jest.fn((file, options, callback) => {
            callback(
                null,
                `
{"questions": [
    {"text": "foo", "choices": ["bar", "baz"], "strategy": {"type": "foo", "correctAnswers": [1]}}
]}`
            );
        });

        const questionLoader = new QuestionLoader();
        try {
            await questionLoader.loadQuiz(
                `${__dirname}/data/quiz-questions.json`
            );
            fail("Expected error to be thrown");
        } catch (e) {
            expect(e).toEqual(new Error("Unknown strategy type: foo"));
        }
    });

    test("rejects promise if reading file fails", async () => {
        const mockError = {};
        fs.readFile = jest.fn((file, options, callback) => {
            callback(mockError, null);
        });

        const questionLoader = new QuestionLoader();
        try {
            await questionLoader.loadQuiz(
                `${__dirname}/data/quiz-questions.json`
            );
            fail("Expected error to be thrown");
        } catch (e) {
            expect(e).toBe(mockError);
        }
    });
});
