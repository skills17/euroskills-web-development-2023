const crypto = require('crypto');
const {
    getCroppedImageUrl,
    determineImage,
    getFinalImageUrl,
    getBaseUrl,
    getZoomOutImageUrl,
    getZoomInImageUrl
} = require("./image-util");

const PROGRESS_VALUES = [0, 15, 30, 45, 60, 75, 100];
const PROGRESS_INTERVAL_MS = 2000;

function getCommandImageUrl(baseUrl, prompt, progress, commandType) {
    if (commandType === 'zoom-in') {
        return getZoomInImageUrl(baseUrl, determineImage(prompt), progress);
    }
    if (commandType === 'zoom-out') {
        return getZoomOutImageUrl(baseUrl, determineImage(prompt), progress);
    }
    return getCroppedImageUrl(baseUrl, determineImage(prompt), progress);
}

function makeProgress(job, baseUrl, prompt, commandType) {
    const progressIndex = PROGRESS_VALUES.indexOf(job.progress);
    if (progressIndex === PROGRESS_VALUES.length - 1) {
        return;
    }

    job.progress = PROGRESS_VALUES[progressIndex + 1];
    job.image_url = getCommandImageUrl(baseUrl, prompt, job.progress, commandType);
    if (progressIndex + 1 === PROGRESS_VALUES.length - 1) {
        job.status = "finished";
        job.finished_at = new Date();
        job.final_image_url = getFinalImageUrl(baseUrl, determineImage(prompt), commandType);
        job.resource_id = crypto.randomUUID();
    }

    scheduleMakingProgress(job, baseUrl, prompt, commandType);
}

function scheduleMakingProgress(job, baseUrl, prompt, commandType) {
    setTimeout(() => makeProgress(job, baseUrl, prompt, commandType), PROGRESS_INTERVAL_MS);
}

function createJob(req, prompt, commandType) {
    const baseUrl = getBaseUrl(req);
    const job = {
        status: "pending",
        progress: 0,
        prompt,
        image_url: getCommandImageUrl(baseUrl, prompt, 0, commandType),
        started_at: new Date(),
    };
    scheduleMakingProgress(job, baseUrl, prompt, commandType);
    return job;
}

module.exports = {
    createJob,
};
