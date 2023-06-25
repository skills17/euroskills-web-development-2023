const fs = require("fs");
const { Question } = require("./Question");
const { SingleAnswerStrategy } = require("./strategies/SingleAnswerStrategy");
const {
    MultipleChoiceStrategy,
} = require("./strategies/MultipleChoiceStrategy");
const {
    MultipleCorrectAnswersStrategy,
} = require("./strategies/MultipleCorrectAnswersStrategy");

class QuestionLoader {
    /**
     *
     * @param {string} file
     * @returns {Promise<Question[]>}
     */
    async loadQuiz(file) {
        const content = await this.readFile(file);
        return content.questions.map(
            (question) =>
                new Question(
                    question.text,
                    question.choices,
                    this.getStrategy(question.strategy)
                )
        );
    }

    /**
     * @private
     */
    readFile(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, null, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const questions = JSON.parse(String(data));
                resolve(questions);
            });
        });
    }

    /**
     * @private
     */
    getStrategy(strategy) {
        switch (strategy.type) {
            case "single":
                return new SingleAnswerStrategy(strategy.correctAnswers);
            case "multiple":
                return new MultipleChoiceStrategy(strategy.correctAnswers);
            case "multiple_correct":
                return new MultipleCorrectAnswersStrategy(
                    strategy.correctAnswers
                );
            default:
                throw new Error(`Unknown strategy type: ${strategy.type}`);
        }
    }
}

module.exports = { QuestionLoader };
