/**
 * @extends {QuestionStrategy}
 */
class MultipleChoiceStrategy {
    /**
     * @param {number[]} correctAnswers
     */
    constructor(correctAnswers) {
        this.correctAnswers = correctAnswers;
        this.maxAnswers = correctAnswers.length;
    }

    /**
     * @param {number[]} userAnswers
     * @returns {boolean}
     */
    checkAnswer(userAnswers) {
        if (this.correctAnswers.length !== userAnswers.length) {
            return false;
        }

        return this.correctAnswers.every((answer) =>
            userAnswers.includes(answer)
        );
    }
}

module.exports = { MultipleChoiceStrategy };
