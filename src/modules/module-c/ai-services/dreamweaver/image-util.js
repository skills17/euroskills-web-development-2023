/**
 * @typedef {'generate'|'upscale'|'zoom-in'|'zoom-out'} commandType
 */

const PROMPT_IMAGE_MAPPING = {
    applause: ['applause', 'clap'],
    'cat-programmer': ['cat'],
    gdansk: ['gdansk', 'poland'],
    opening: ['opening', 'ceremony'],
    podium: ['podium'],
}

function determineImage(prompt) {
    const promptLowerCase = prompt.toLowerCase();

    const matchingImages = Object.keys(PROMPT_IMAGE_MAPPING)
        .filter(image => PROMPT_IMAGE_MAPPING[image].some(keyword => promptLowerCase.includes(keyword)));

    if (matchingImages.length > 0) {
        return matchingImages[0]
    }

    // select random image by char code (so it remains deterministic)
    const code = (prompt || 'a').charCodeAt(0);
    const images = Object.keys(PROMPT_IMAGE_MAPPING);

    return images[code % images.length];
}

function getImageUrl(baseUrl, imagePath) {
    return `${baseUrl}/images/${encodeURIComponent(imagePath)}`;
}

function getCroppedImageUrl(baseUrl, image, progress) {
    return getImageUrl(baseUrl, `cropped/${image}-${progress}.png`)
}

function getZoomInImageUrl(baseUrl, image, progress) {
    return getImageUrl(baseUrl, `zoom-in/${image}-${progress}.png`)
}

function getZoomOutImageUrl(baseUrl, image, progress) {
    return getImageUrl(baseUrl, `zoom-out/${image}-zoomout.png`)
}

/**
 * @param {string} baseUrl
 * @param {string} image
 * @param {commandType} commandType
 * @return {string}
 */
function getFinalImageUrl(baseUrl, image, commandType) {
    if (commandType === "upscale") {
        return getImageUrl(baseUrl, `upscale/${image}-upscale.png`)
    }
    if (commandType === "zoom-out") {
        return getImageUrl(baseUrl, `zoom-out/${image}-zoomout.png`)
    }

    return getImageUrl(baseUrl, `final/${image}.png`)
}

function getBaseUrl(req) {
    return `${req.protocol}://${req.get("host")}`;
}

module.exports = {
    getBaseUrl,
    determineImage,
    getFinalImageUrl,
    getCroppedImageUrl,
    getZoomInImageUrl,
    getZoomOutImageUrl
}
