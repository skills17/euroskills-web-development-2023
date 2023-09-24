const {
    MultipleCorrectAnswersStrategy,
} = require("./MultipleCorrectAnswersStrategy");

describe("MultipleCorrectAnswersStrategy", () => {
    test("checkAnswer() returns true if all answers are correct", () => {
        const strategy = new MultipleCorrectAnswersStrategy([1, 2, 3]);
        expect(strategy.maxAnswers).toBe(1);
        expect(strategy.checkAnswer([1])).toBe(true);
    });

    test("checkAnswer() returns false if wrong number of answers are given", () => {
        const strategy = new MultipleCorrectAnswersStrategy([1, 2, 3]);
        expect(strategy.maxAnswers).toBe(1);
        expect(strategy.checkAnswer([1, 2, 3])).toBe(false);
    });
});
