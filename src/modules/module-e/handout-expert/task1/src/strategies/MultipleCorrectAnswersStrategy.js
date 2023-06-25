/**
 * @extends {QuestionStrategy}
 */
class MultipleCorrectAnswersStrategy {
    /**
     * @param {number[]} correctAnswers
     */
    constructor(correctAnswers) {
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
            this.correctAnswers.includes(userAnswers[0])
        );
    }
}

module.exports = { MultipleCorrectAnswersStrategy };
