// This file is not used in the project, it is just for demonstration purposes.

function sum(a, b) {
    return a + b;
}

describe("sum", () => {
    test("adds 1 + 2 to equal 3", () => {
        expect(sum(1, 2)).toBe(3);
    });
});
