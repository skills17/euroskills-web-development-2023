/**
 * Task 6 — Regex
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
            description: "Skip specific number",
            maxLength: 4,
            matches: ["1", "2", "3", "4", "6", "7", "8", "9"],
            skip: ["5"],
            regex: /[^5]/ // TODO
        },

        // Regex #2
        {
            description: "Word boundary",
            maxLength: 5,
            matches: ["His leg", "Kiss", "bliss"],
            skip: ["He is nice", "me.is.good", "ha\nba\nka\nis"],
            regex: /\Bis/ // TODO
        },

        // Regex #3
        {
            description: "Ending in",
            maxLength: 3,
            matches: ["main", "gain", "join", "pain", "grain", "pumpkin", "in"],
            skip: ["nine", "mine", "foo", "skinny"],
            regex: /in$/ // TODO
        },

        // Regex #4
        {
            description: "Comments",
            maxLength: 25,
            matches: [
                "// This is a comment!",
                "alert(my_string);//another comment",
                "/* This is\n * a multiline\n * comment!\n */",
                "/* programs/applications 16/*(4*2)=2 */",
                "do_stuff(/* arguments here */);",
                "//",
                "/**/"
            ],
            skip: [
                "var sample    = 0;",
                "var new       = 1;",
                "var my_string = \"Hello World!\";",
                "function do_stuff(){",
                "var something;"
            ],
            regex: /\/\*[\s\S]*?\*\/|\/\/.*/ // TODO
        },

        // Regex #5
        {
            description: "Word repetition",
            maxLength: 12,
            matches: ["word word word2", "blue red red blue", "mega giga peta peta"],
            skip: ["foo bar baz", "this has many words but not matched", "this has no word repetition"],
            regex: /([a-z]+) \1/ // TODO
        },

        // Regex #6
        {
            description: "24 hour time",
            maxLength: 50,
            matches: ["23:50:00", "14:00", "23:00", "9:30", "19:30"],
            skip: ["9:30 PM", "24:00", "12", "14:30:00:30"],
            regex: /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/ // TODO
        },

    ]
};
