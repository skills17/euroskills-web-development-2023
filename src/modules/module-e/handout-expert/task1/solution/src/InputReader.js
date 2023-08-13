const readline = require("readline");

class InputReader {
    constructor() {
        // Creates an open interface to read from stdin
        // IMPORTANT: We need to close the interface when we are done, or we get a hanging program.
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    close() {
        this.rl.close();
    }

    /**
     * @param {Question} question
     * @returns {Promise<number[]>}
     */
    async readAnswers(question) {
        return new Promise((resolve) => {
            let query = "Enter your answer: ";
            if (question.strategy.maxAnswers > 1) {
                query = "Enter your answers (separated by a comma): ";
            }
            this.rl.question(query, (answer) => {
                this.handleAnswer(answer, question, query, resolve);
            });
        });
    }

    /**
     * @private
     */
    handleAnswer(answer, question, query, resolve) {
        const invalidAnswers = this.getInvalidAnswers(answer, question);

        if (invalidAnswers.length > 0) {
            const invalidQueryTryAgain = `Invalid choice${
                invalidAnswers.length > 1 ? "s" : ""
            }: ${invalidAnswers.join(", ")}\n${query}`;
            this.rl.question(invalidQueryTryAgain, (answer) => {
                this.handleAnswer(answer, question, query, resolve);
            });
            return;
        }

        resolve(answer.split(",").map((string) => parseInt(string)));
    }

    /**
     * @private
     */
    getInvalidAnswers(answer, question) {
        return answer
            .split(",")
            .map((string) => string.trim())
            .filter((string) => {
                const number = parseInt(string);
                return !!(
                    isNaN(number) ||
                    number < 1 ||
                    number > question.choices.length
                );
            });
    }
}

module.exports = { InputReader };
