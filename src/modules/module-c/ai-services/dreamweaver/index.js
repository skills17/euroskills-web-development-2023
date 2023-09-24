const express = require("express");
const path = require("path");
const {createJob} = require("./generator");

const app = express();
app.use(express.json());

// Mock data
let jobCounter = 1;
const jobs = {};
const resources = {};


// Generate an image based on a text prompt
app.post("/generate", (req, res) => {
    const {text_prompt} = req.body;

    if (!text_prompt) {
        return res.status(400).send("Invalid request body");
    }

    if (text_prompt === "test_error") {
        res.status(500).json({ error: "Test error. You just entered something which provokes a test error." });
        return;
    }

    const job_id = `job_${jobCounter++}`;

    // Create a new job entry
    jobs[job_id] = createJob(req, text_prompt, 'generate');

    res.status(201).json({
        job_id,
        started_at: jobs[job_id].started_at.toISOString(),
    });
});

// Get the status and progress of a job
app.get("/status/:job_id", (req, res) => {
    const {job_id} = req.params;
    const job = jobs[job_id];

    if (!job) {
        return res.status(400).send("Job not found");
    }

    res.status(200).json({
        status: job.status,
        progress: job.progress,
        image_url: job.image_url,
    });
});

// Get the result of a finished job
app.get("/result/:job_id", (req, res) => {
    const {job_id} = req.params;
    const job = jobs[job_id];

    if (!job) {
        return res.status(400).send("Job not found");
    }

    if (job.status !== "finished") {
        return res.status(400).send("Job is not finished yet");
    }

    resources[job.resource_id] = job.prompt;

    const result = {
        resource_id: job.resource_id,
        image_url: job.final_image_url,
        finished_at: job.finished_at.toISOString(),
    };

    res.status(200).json(result);
});

// Upscale a generated image
app.post("/upscale", (req, res) => {
    const {resource_id} = req.body;
    const resource = resources[resource_id];

    if (!resource) {
        return res.status(400).send("Resource not found");
    }

    const job_id = `job_${jobCounter++}`;

    // Create a new job entry
    jobs[job_id] = createJob(req, resource, 'upscale');

    res.status(201).json({
        job_id,
        started_at: jobs[job_id].started_at.toISOString(),
    });
});

// Zoom in on a generated image
app.post("/zoom/in", (req, res) => {
    const {resource_id} = req.body;
    const resource = resources[resource_id];

    if (!resource) {
        return res.status(400).send("Resource not found");
    }

    const job_id = `job_${jobCounter++}`;

    // Create a new job entry
    jobs[job_id] = createJob(req, resource, 'zoom-in');

    res.status(201).json({
        job_id,
        started_at: jobs[job_id].started_at.toISOString(),
    });
});

// Zoom out on a generated image
app.post("/zoom/out", (req, res) => {
    const {resource_id} = req.body;
    const resource = resources[resource_id];

    if (!resource) {
        return res.status(400).send("Resource not found");
    }

    const job_id = `job_${jobCounter++}`;

    // Create a new job entry
    jobs[job_id] = createJob(req, resource, 'zoom-out');

    res.status(201).json({
        job_id,
        started_at: jobs[job_id].started_at.toISOString(),
    });
});

// Serve images from the local filesystem
app.get("/images/:image_id", (req, res) => {
    const {image_id} = req.params;
    const imagePath = path.join(__dirname, "images", `${image_id}`);

    // You can customize this part to handle image not found scenarios
    // For example, if the image doesn't exist, you can return a 404 response.
    res.sendFile(imagePath);
});

function shutDown() {
    console.log("Received kill signal, shutting down");
    process.exit(0);
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Dreamweaver is running on port ${port}`);
});
