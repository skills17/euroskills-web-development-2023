const {
    commonWords,
    consonants,
    vowels,
    punctuations,
    specificWords,
    surprisingAnswers,
} = require("./answers");

function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

const randomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
const capitalizeFirstLetter = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1);

function getRandomWord() {
    const commonProbability = 0.7; // Probability of selecting a common word
    const randomValue = Math.random();

    if (randomValue < commonProbability) {
        // Select a common word randomly
        const randomIndex = Math.floor(Math.random() * commonWords.length);
        return commonWords[randomIndex];
    }

    // Generate a random word with letters 'a' to 'z' and length between 3 and 10
    const wordLength = Math.floor(Math.random() * 8) + 3;
    let word = "";

    // Start the word with a random consonant
    word += capitalizeFirstLetter(randomChar(consonants));

    for (let i = 0; i < wordLength - 1; i++) {
        // Alternate between vowels and consonants
        const charSet = i % 2 === 0 ? vowels : consonants;
        word += randomChar(charSet);
    }

    if (Math.random() < 0.2) {
        word += randomChar(punctuations);
    }

    return word;
}

function generateLongResponse() {
    const minLength = 200;
    const maxLength = 1000;

    const responseLength =
        Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let response = "";

    while (response.length < responseLength) {
        const word = getRandomWord(); // Custom function to get a random word
        response += word + " ";
    }

    response = response.trim();
    return response;
}

function generateResponse(userInput) {
    for (const {pattern, responses} of specificWords) {
        if (pattern.test(userInput)) {
            return getRandomResponse(responses);
        }
    }
    if (Math.random() < 0.2) {
        return getRandomResponse(surprisingAnswers);
    }

    return generateLongResponse();
}

function fakeSlowResponse(conversation) {
    const {start, response} = conversation;

    const timeElapsed = new Date() - start;
    const charactersPerSecond = 50;

    const charactersToReturn = (timeElapsed / 1000) * charactersPerSecond;
    const isResponseFinal = response.length <= charactersToReturn;

    if (isResponseFinal) {
        return `${response}<EOF>Took ${
            Math.round((response.length / charactersPerSecond) * 100000) / 100
        }ms`;
    }

    return response.substring(0, charactersToReturn);
}

module.exports = {generateResponse, fakeSlowResponse};
