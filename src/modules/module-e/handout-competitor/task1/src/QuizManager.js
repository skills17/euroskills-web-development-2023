class QuizManager {
    /**
     * @param {Question[]} questions
     * @param {OutputManager} outputManager
     * @param {InputReader} inputReader
     */
    constructor(questions, outputManager, inputReader) {
        if (questions.length === 0) {
            throw new Error("No questions given");
        }
        this.questions = questions;
        this.outputManager = outputManager;
        this.inputReader = inputReader;
        this.currentIndex = 0;
    }

    async startQuiz() {
        this.displayQuestion();
        await this.answerQuestion();
    }

    /**
     * @private
     */
    displayQuestion() {
        const currentQuestion = this.questions[this.currentIndex];
        this.outputManager.display(
            `Question ${this.currentIndex + 1}: ${currentQuestion.text}`
        );
        currentQuestion.choices.forEach((choice, index) => {
            this.outputManager.display(`${index + 1}. ${choice}`);
        });
    }

    /**
     * @private
     */
    async answerQuestion() {
        const answers = await this.inputReader.readAnswers(
            this.questions[this.currentIndex]
        );
        const currentQuestion = this.questions[this.currentIndex];

        if (currentQuestion.strategy.checkAnswer(answers)) {
            this.outputManager.display("Correct!\n", "green");
        } else {
            this.outputManager.display(
                `Incorrect!\nCorrect answer${
                    currentQuestion.strategy.correctAnswers.length !== 1
                        ? "s"
                        : ""
                }: ${currentQuestion.strategy.correctAnswers.join(", ")}\n`,
                "red"
            );
        }
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            this.displayQuestion();
            await this.answerQuestion();
        } else {
            this.outputManager.display("Quiz finished!");
        }
    }
}

module.exports = { QuizManager };
