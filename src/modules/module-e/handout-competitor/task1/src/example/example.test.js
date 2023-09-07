// This file is not used in the project, it is just for demonstration purposes.
// This file shall not be marked.

function sum(a, b) {
    return a + b;
}

describe("example", () => {
    test("adds 1 + 2 to equal 3", () => {
        expect(sum(1, 2)).toBe(3);
    });

    test("two objects are equal", () => {
        expect({
            foo: "bar",
            baz: "foz",
        }).toEqual({
            foo: "bar",
            baz: expect.any(String)
        });
    });

    test("two objects are strictly equal", () => {
        expect({
            foo: "bar",
            baz: "foz",
        }).toStrictEqual({
            foo: "bar",
            baz: "foz"
        });
    });

    test("function throws", () => {
        expect(() => {
            throw new Error("foo");
        }).toThrow(
            new Error("foo")
        );
    });

    test("mock function has been called", () => {
        const mockService = {doStuff: jest.fn()};

        mockService.doStuff("foo");
        mockService.doStuff("bar");

        expect(mockService.doStuff).toHaveBeenNthCalledWith(1, "foo");
        expect(mockService.doStuff).toHaveBeenNthCalledWith(2, "bar");
    });
});
