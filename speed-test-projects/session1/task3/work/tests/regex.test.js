describe('regex', () => {
    it('Regex #1', () => evaluateRegex(1));
    it('Regex #2', () => evaluateRegex(2));
    it('Regex #3', () => evaluateRegex(3));
    it('Regex #4', () => evaluateRegex(4));
    it('Regex #5', () => evaluateRegex(5));
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
        maxLength: 5,
        matches: ["Hello", "Hi", "hello World", "euroSkills", "JavaScript", "regEx"],
        skip: ["hello", "hi", "hello world", "2021", "euro_skills", "javascript", "regex"],
    },
    // Regex #2
    {
        maxLength: 10,
        matches: ["HELLO", "HI", "HELLO WORLD", "EUROSKILLS", "JAVASCRIPT", "REGEX"],
        skip: ["Hello", "Hi", "hello World", "euroSkills", "JavaScript", "regEx", "hello", "hi", "hello world", "2021", "euro_skills", "javascript", "regex"],
    },
    // Regex #3
    {
        maxLength: 14,
        matches: ["- Bohemian Rhapsody", "  - Is this the real life?", "* Is this just fantasy?", "  * Caught in a landslide", "1. No escape from reality", "5. Open your eyes"],
        skip: ["# EuroSkills", "*Europe*", "-Dancing Queen-", "Changed: - test to: tests", "1a good job"],
    },
    // Regex #4
    {
        maxLength: 60,
        matches: ["123e4567-e89b-12d3-a456-426614174000", "234f5678-f9ac-23e4-b567-537725285111"],
        skip: ["123e4567-e89b-12d3-a456-42661417400", "123e4567e89b12d3a45642661417400", "123e457-e89b-12d3-a456-426614174000", "123e4567-e89ba-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-42661417400z", "g23e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a4565-426614174000"],
    },
    // Regex #5
    {
        maxLength: 20,
        matches: ["word1 word2 word3", "Foo, Bar, Baz", "More than three words is okay too"],
        skip: ["not_enough_words", "no word", "Hello World"],
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
