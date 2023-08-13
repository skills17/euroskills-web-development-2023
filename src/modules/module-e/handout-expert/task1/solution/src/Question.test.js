const { Question } = require("./Question");

describe("Question", () => {
    test("creates question", () => {
        const question = new Question("test", ["test"], {
            correctAnswers: [1],
            checkAnswer: () => true,
            maxAnswers: 1,
        });
        expect(question).toEqual({
            text: "test",
            choices: ["test"],
            strategy: {
                correctAnswers: [1],
                checkAnswer: expect.any(Function),
                maxAnswers: 1,
            },
        });
    });
});
