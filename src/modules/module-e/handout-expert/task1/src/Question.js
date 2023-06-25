/**
 * @typedef {Object} QuestionStrategy
 * @property {number[]} correctAnswers
 * @property {function(number[]): boolean} checkAnswer
 * @property {number} maxAnswers
 */

class Question {
    /**
     * @param {string} text
     * @param {string[]} choices
     * @param {QuestionStrategy} strategy
     */
    constructor(text, choices, strategy) {
        this.text = text;
        this.choices = choices;
        this.strategy = strategy;
    }
}

module.exports = { Question };
