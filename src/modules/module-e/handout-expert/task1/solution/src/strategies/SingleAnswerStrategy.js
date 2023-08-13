/**
 * @extends {QuestionStrategy}
 */
class SingleAnswerStrategy {
    /**
     * @param {number[]} correctAnswers
     */
    constructor(correctAnswers) {
        if (correctAnswers.length !== 1) {
            throw new Error(
                `SingleAnswerStrategy requires exactly 1 answer, got ${correctAnswers.length}`
            );
        }
        this.correctAnswers = correctAnswers;
        this.maxAnswers = 1;
    }

    /**
     * @param {number[]} userAnswers
     * @returns {boolean}
     */
    checkAnswer(userAnswers) {
        return (
            userAnswers.length === 1 &&
            this.correctAnswers[0] === userAnswers[0]
        );
    }
}

module.exports = { SingleAnswerStrategy };
