const { OutputManager } = require("./OutputManager");

describe("OutputManager", () => {
    test("displays message in default color", () => {
        const outputManager = new OutputManager();
        // mock console.log
        console.log = jest.fn();
        outputManager.display("test");
        expect(console.log).toHaveBeenCalledWith("test");
    });

    test("displays message in red", () => {
        const outputManager = new OutputManager();
        // mock console.log
        console.log = jest.fn();
        outputManager.display("test", "red");
        expect(console.log).toHaveBeenCalledWith("\x1b[31m%s\x1b[0m", "test");
    });

    test("displays message in green", () => {
        const outputManager = new OutputManager();
        // mock console.log
        console.log = jest.fn();
        outputManager.display("test", "green");
        expect(console.log).toHaveBeenCalledWith("\x1b[32m%s\x1b[0m", "test");
    });
});
