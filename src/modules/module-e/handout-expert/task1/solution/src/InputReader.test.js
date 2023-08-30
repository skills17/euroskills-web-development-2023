const { InputReader } = require("./InputReader");

describe("InputReader", () => {
    const question = {
        choices: ["test"],
        strategy: {
            maxAnswers: 1,
        },
    };

    test("reads single input", async () => {
        const inputReader = new InputReader();
        inputReader.close(); // close original readline
        // mock readline
        inputReader.rl = {
            question: (question, callback) => {
                expect(question).toBe("Enter your answer: ");
                callback("1");
            },
        };
        expect(await inputReader.readAnswers(question)).toStrictEqual([1]);
    });

    test("close closes readline", () => {
        const inputReader = new InputReader();
        inputReader.close();
        expect(inputReader.rl.closed).toBeTruthy();
    });

    test("reads multiple inputs", async () => {
        const inputReader = new InputReader();
        inputReader.close(); // close original readline

        // mock readline
        inputReader.rl = {
            question: (question, callback) => {
                expect(question).toBe(
                    "Enter your answers (separated by a comma): "
                );
                callback("1, 2");
            },
        };
        const question = {
            choices: ["test1", "test2"],
            strategy: {
                maxAnswers: 2,
            },
        };
        expect(await inputReader.readAnswers(question)).toStrictEqual([1, 2]);
    });

    test("detects invalid input with multiple wrong choices", async () => {
        await assertInvalidInputDetection(" 3, 5 ", "3, 5");
    });

    test("detects invalid input lower than 1", async () => {
        await assertInvalidInputDetection("0", "0");
    });

    test("detects invalid input not a number", async () => {
        await assertInvalidInputDetection("a", "a");
    });

    test("detects invalid input greater than number of choices", async () => {
        await assertInvalidInputDetection("2", "2");
    });

    async function assertInvalidInputDetection(input, inputFormatted) {
        const inputReader = new InputReader();
        inputReader.close(); // close original readline

        // mock readline
        let submittedInvalidAnswer = false;
        let submittedValidAnswer = false;
        inputReader.rl = {
            question: (question, callback) => {
                if (!submittedInvalidAnswer) {
                    expect(question).toBe("Enter your answer: ");
                    submittedInvalidAnswer = true;
                    callback(input);
                } else {
                    expect(question).toBe(
                        `Invalid choice${
                            inputFormatted.includes(",") ? "s" : ""
                        }: ${inputFormatted}
Enter your answer: `
                    );
                    submittedValidAnswer = true;
                    callback("1");
                }
            },
        };
        await inputReader.readAnswers(question);
        expect(submittedInvalidAnswer).toBe(true);
        expect(submittedValidAnswer).toBe(true);
    }
});
