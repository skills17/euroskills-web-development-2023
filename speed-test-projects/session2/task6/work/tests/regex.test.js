describe('regex', () => {
    it('Regex #1', () => evaluateRegex(1));
    it('Regex #2', () => evaluateRegex(2));
    it('Regex #3', () => evaluateRegex(3));
    it('Regex #4', () => evaluateRegex(4));
    it('Regex #5', () => evaluateRegex(5));
    it('Regex #6', () => evaluateRegex(6));
});

/**
 * Duplicate of regex.js without the regex itself. Necessary because the candidate could theoretically change these and
 * by keeping it in the test file, we can ensure we have valid definitions.
 */
const regexDefinitions = [
    // Regex #0: Example
    {},
    // Regex #1
    {
        maxLength: 4,
        matches: ["1", "2", "3", "4", "6", "7", "8", "9"],
        skip: ["5"],
    },
    // Regex #2
    {
        maxLength: 5,
        matches: ["His leg", "Kiss", "bliss"],
        skip: ["He is nice", "me.is.good", "ha\nba\nka\nis"],
    },
    // Regex #3
    {
        maxLength: 3,
        matches: ["main", "gain", "join", "pain", "grain", "pumpkin", "in"],
        skip: ["nine", "mine", "foo", "skinny"],
    },
    // Regex #4
    {
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
    },
    // Regex #5
    {
        maxLength: 12,
        matches: ["word word word2", "blue red red blue", "mega giga peta peta"],
        skip: ["foo bar baz", "this has many words but not matched", "this has no word repetition"],
    },
    // Regex #6
    {
        maxLength: 50,
        matches: ["23:50:00", "14:00", "23:00", "9:30", "19:30"],
        skip: ["9:30 PM", "24:00", "12", "14:30:00:30"],
    },
];

function evaluateRegex(index) {

    const {matches, skip, maxLength} = regexDefinitions[index];
    const {regex} = regexSolutions.solutions[index];

    // Test if regex is defined
    if (!regex) {
        expect.fail(`No regex defined.`);

        return;
    }

    // Test if regex is short enough
    if (regex.source.length > maxLength) {
        const oversize = regex.source.length - maxLength;
        expect.fail(`Regex is ${oversize} characters too long. Try to shorten it.`);

        return;
    }

    // Compute results
    const results = mapRegexMatch(true, matches, regex)
        .concat(mapRegexMatch(false, skip, regex));

    // Test for success
    if (results.every(result => result.success)) {
        return;
    }

    // Fail code path
    expect.fail(`Regex is incorrect. \n${reportShouldMatch(results)}\n${reportShouldNotMatch(results)}`);
}

function mapRegexMatch(shouldMatch, strings, regex) {
    if (!strings) {
        return [];
    }

    if (!Array.isArray(strings)) {
        return Object.keys(strings).map(key => {
            const result = regex.exec(key);

            return {
                string: `${key}: ${strings[key]}`,
                shouldMatch,
                success: !strings[key] || (result && result[1] === strings[key])
            };
        });
    }

    return strings.map(string => ({
        string,
        shouldMatch,
        success: regex.test(string) ? shouldMatch : !shouldMatch
    }));
}

function reportShouldMatch(results) {
    if (!results.some(result => result.shouldMatch && !result.success)) {
        return '';
    }
    return `Your regex should match the following strings:\n${results.filter(result => result.shouldMatch)
        .filter(result => !result.success)
        .map(result => ` - ${result.string}`)
        .join('\n')}`;
}

function reportShouldNotMatch(results) {
    if (!results.some(result => !result.shouldMatch && !result.success)) {
        return '';
    }
    return `Your regex should not match the following strings:\n${results.filter(result => !result.shouldMatch)
        .filter(result => !result.success)
        .map(result => ` - ${result.string}`)
        .join(('\n'))}`;
}
