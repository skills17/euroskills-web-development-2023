const { SingleAnswerStrategy } = require("./SingleAnswerStrategy");

describe("SingleAnswerStrategy", () => {
    test("throws if not exactly 1 answer given", () => {
        expect(() => new SingleAnswerStrategy([1, 2, 3])).toThrow(
            new Error("SingleAnswerStrategy requires exactly 1 answer, got 3")
        );
    });

    test("checkAnswer() returns false if wrong answer given", () => {
        const strategy = new SingleAnswerStrategy([2]);
        expect(strategy.maxAnswers).toBe(1);
        expect(strategy.checkAnswer([1])).toBe(false);
    });

    test("checkAnswer() returns false if wrong number of answers are given", () => {
        const strategy = new SingleAnswerStrategy([2]);
        expect(strategy.maxAnswers).toBe(1);
        expect(strategy.checkAnswer([2, 1])).toBe(false);
    });

    test("checkAnswer() returns true if correct answer given", () => {
        const strategy = new SingleAnswerStrategy([2]);
        expect(strategy.maxAnswers).toBe(1);
        expect(strategy.checkAnswer([2])).toBe(true);
    });
});
