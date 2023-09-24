const { MultipleChoiceStrategy } = require("./MultipleChoiceStrategy");

describe("MultipleChoiceStrategy", () => {
    test("checkAnswer() returns true if all answers are correct", () => {
        const strategy = new MultipleChoiceStrategy([1, 2, 3]);
        expect(strategy.maxAnswers).toBe(3);
        expect(strategy.checkAnswer([1, 2, 3])).toBe(true);
    });

    test("checkAnswer() returns false if wrong number of answers are given", () => {
        const strategy = new MultipleChoiceStrategy([1, 2, 3]);
        expect(strategy.maxAnswers).toBe(3);
        expect(strategy.checkAnswer([1, 2, 3, 4])).toBe(false);
    });

    test("checkAnswer() returns false if any answer is incorrect", () => {
        const strategy = new MultipleChoiceStrategy([1, 2, 3]);
        expect(strategy.maxAnswers).toBe(3);
        expect(strategy.checkAnswer([1, 2, 4])).toBe(false);
    });
});
