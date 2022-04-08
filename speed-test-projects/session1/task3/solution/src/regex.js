/**
 * Task 3 — Regex
 */

/*
 * Regex
 *
 * Write your solutions into the "regex" property of each sub task.
 * Do not alter anything else in this file.
 */

var regexSolutions = {
    solutions: [
        // Regex #0: Example
        // THIS IS AN EXAMPLE
        {
            description: "Example",

            // The maximum length the regex can be. If it's longer, there will be no points awarded.
            maxLength: 4,

            // The regex must match these strings using RegExp.prototype.test
            matches: ["a", "b"],

            // The regex must not match these strings
            skip: ["c"],

            // Write your regex here
            regex: /[ab]/
        },

        // -----------------------------------------
        // TODO:
        // Sub tasks that will be marked start here.

        // Regex #1
        {
            description: "Contains any upper case letter",
            maxLength: 5,
            matches: ["Hello", "Hi", "hello World", "euroSkills", "JavaScript", "regEx"],
            skip: ["hello", "hi", "hello world", "2021", "euro_skills", "javascript", "regex"],
            regex: /[A-Z]/ // TODO
        },

        // Regex #2
        {
            description: "Contains only upper case letters",
            maxLength: 10,
            matches: ["HELLO", "HI", "HELLO WORLD", "EUROSKILLS", "JAVASCRIPT", "REGEX"],
            skip: ["Hello", "Hi", "hello World", "euroSkills", "JavaScript", "regEx", "hello", "hi", "hello world", "2021", "euro_skills", "javascript", "regex"],
            regex: /^[A-Z ]+$/ // TODO
        },

        // Regex #3
        {
            description: "Markdown list item",
            maxLength: 14,
            matches: ["- Bohemian Rhapsody", "  - Is this the real life?", "* Is this just fantasy?", "  * Caught in a landslide", "1. No escape from reality", "5. Open your eyes"],
            skip: ["# EuroSkills", "*Europe*", "-Dancing Queen-", "Changed: - test to: tests", "1a good job"],
            regex: /^ *[-*1-9]\.? / // TODO
        },

        // Regex #4
        {
            description: "UUID",
            maxLength: 60,
            matches: ["123e4567-e89b-12d3-a456-426614174000", "234f5678-f9ac-23e4-b567-537725285111"],
            skip: ["123e4567-e89b-12d3-a456-42661417400", "123e4567e89b12d3a45642661417400", "123e457-e89b-12d3-a456-426614174000", "123e4567-e89ba-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-42661417400z", "g23e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a4565-426614174000"],
            regex: /[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/ // TODO
        },

        // Regex #5
        {
            description: "Minimum 3 words",
            maxLength: 20,
            matches: ["word1 word2 word3", "Foo, Bar, Baz", "More than three words is okay too"],
            skip: ["not_enough_words", "no word", "Hello World"],
            regex: /( \w.+){2,}/ // TODO
        },
    ]
};
