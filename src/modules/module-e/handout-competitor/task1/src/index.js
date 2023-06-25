const { QuizManager } = require("./QuizManager");
const { OutputManager } = require("./OutputManager");
const { InputReader } = require("./InputReader");
const { QuestionLoader } = require("./QuestionLoader");

(async () => {
    const questionLoader = new QuestionLoader();
    const outputManager = new OutputManager();
    const inputReader = new InputReader();
    const questions = await questionLoader.loadQuiz(
        `${__dirname}/data/quiz-questions.json`
    );
    const quizManager = new QuizManager(questions, outputManager, inputReader);
    await quizManager.startQuiz();
    inputReader.close();
})();
