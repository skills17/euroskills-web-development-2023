const express = require("express");

const {generateResponse, fakeSlowResponse} = require("./bot");

const app = express();
app.use(express.json());
app.use(express.text());

// Store conversation responses
const conversationResponses = {};

// POST endpoint to receive conversation input
app.post("/conversation", (req, res) => {
    const {conversationId} = req.body;

    if (!conversationId) {
        res.status(400).json({
            error: "Invalid request body.",
            body: req.body,
        });
        return;
    }

    if (conversationId === "test_error") {
        res.status(500).json({error: "Test error. You just entered something which provokes a test error."});
        return;
    }

    if (conversationResponses[conversationId]) {
        res.status(400).json({error: "Conversation ID already exists."});
        return;
    }

    conversationResponses[conversationId] = {inProgress: false, response: ""};
    res.status(201).send();
});

app.post("/conversation/:conversationId", (req, res) => {
    const {conversationId} = req.params;
    const prompt = req.body;

    if (!conversationId) {
        res.status(400).json({
            error: "Invalid conversation id.",
            body: req.body,
        });
        return;
    }

    if (!conversationResponses[conversationId]) {
        res.status(400).json({error: "Conversation does not exist."});
        return;
    }

    if (conversationId === "test_error" || prompt === "test_error") {
        res.status(500).json({error: "Test error. You just entered something which provokes a test error."});
        return;
    }

    if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({
            error: "Request body cannot be empty or is not Content-Type text/plain.",
            body: req.body,
        });
        return;
    }

    conversationResponses[conversationId] = {
        inProgress: true,
        start: new Date(),
        response: generateResponse(prompt),
    };
    res.status(200).send();
});

// GET endpoint to fetch conversation response
app.get("/conversation/:conversationId", (req, res) => {
    const {conversationId} = req.params;

    if (!conversationId) {
        res.status(400).json({
            error: "Invalid conversation id.",
            body: req.body,
        });
        return;
    }

    if (conversationId === "test_error") {
        res.status(500).json({error: "Test error. You just entered something which provokes a test error."});
        return;
    }

    // Check if the conversation response exists
    if (!conversationResponses[conversationId]) {
        // Send an error response if conversation ID is not found
        res.status(400).json({error: "Conversation ID not found."});
        return;
    }
    const response = conversationResponses[conversationId];

    res.send(fakeSlowResponse(response));
});

function shutDown() {
    console.log("Received kill signal, shutting down");
    process.exit(0);
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Chatterblast is running on port ${port}`);
});
