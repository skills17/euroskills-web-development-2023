const express = require("express");
const busboy = require('busboy');
const cors = require('cors');
const exif = require('exif-parser');

const FILENAME_RESPONSE_MOCKS = {
    construction: {
        objects: [{
            label: "Construction Workers",
            probability: 0.87,
            bounding_box: {top: 465, left: 315, bottom: 744, right: 740}
        }, {
            label: "Digger",
            probability: 0.67,
            bounding_box: {top: 430, left: 110, bottom: 524, right: 350}
        }, {
            label: "Digger",
            probability: 0.69,
            bounding_box: {top: 420, left: 350, bottom: 526, right: 450}
        }, {
            label: "Digger",
            probability: 0.86,
            bounding_box: {top: 380, left: 590, bottom: 544, right: 820}
        }, {
            label: "Sunset",
            probability: 0.98,
            bounding_box: {top: 300, left: 350, bottom: 504, right: 800}
        }]
    },
    convention: {
        objects: [{
            label: "TV",
            probability: 0.98,
            bounding_box: {top: 450, left: 460, bottom: 544, right: 575}
        }, {
            label: "Couch",
            probability: 0.44,
            bounding_box: {top: 600, left: 0, bottom: 1024, right: 490}
        }, {
            label: "Show Lights",
            probability: 0.6,
            bounding_box: {top: 10, left: 300, bottom: 274, right: 1024}
        }]
    },
    countryside: {
        objects: [{
            label: "Hut",
            probability: 0.32,
            bounding_box: {top: 210, left: 490, bottom: 584, right: 1015}
        }, {
            label: "Stork",
            probability: 0.93,
            bounding_box: {top: 745, left: 690, bottom: 1004, right: 900}
        }]
    },
    electronics: {
        objects: [{
            label: "Engineer",
            probability: 0.78,
            bounding_box: {top: 405, left: 600, bottom: 1004, right: 980}
        }, {
            label: "Robot",
            probability: 0.99,
            bounding_box: {top: 130, left: 72, bottom: 597, right: 333}
        }, {
            label: "Robot",
            probability: 0.99,
            bounding_box: {top: 160, left: 580, bottom: 584, right: 938}
        }]
    },
    street: {
        objects: [{
            label: "Tram",
            probability: 0.12,
            bounding_box: {top: 410, left: 123, bottom: 874, right: 625}
        }, {
            label: "Car",
            probability: 0.39,
            bounding_box: {top: 666, left: 711, bottom: 724, right: 800}
        }, {
            label: "Pedestrian",
            probability: 0.51,
            bounding_box: {top: 651, left: 820, bottom: 854, right: 905}
        }]
    },
    default: {objects: []}
};

const app = express();
app.use(express.json());
app.use(express.text());
app.use(cors())

function getResponseMock(imageDescription) {
    if (!imageDescription) {
        return "default";
    }
    if (imageDescription.includes('construction')) {
        return "construction";
    }
    if (imageDescription.includes('convention')) {
        return "convention";
    }
    if (imageDescription.includes('countryside')) {
        return "countryside";
    }
    if (imageDescription.includes('electronics')) {
        return "electronics";
    }
    if (imageDescription.includes('street')) {
        return "street";
    }
    return "default";
}

app.post("/recognize", (req, res) => {

    const bb = busboy({headers: req.headers});
    let responseMock = 'default';
    let receivedData = false;
    let buffers = [];
    bb.on('file', (name, file, info) => {
        file.on('data', (data) => {
            receivedData = receivedData || data.length > 0;
            buffers.push(data);
        }).on('close', () => {
            if (receivedData) {
                try {
                    const parser = exif.create(Buffer.concat(buffers));
                    const metadata = parser.parse();
                    if (metadata && metadata.tags && metadata.tags.ImageDescription) {
                        if (metadata.tags.ImageDescription === 'test_error') {
                            res.status(500).json({error: "Test error. You just entered something which provokes a test error."});
                            return;
                        }
                        responseMock = metadata && metadata.tags && getResponseMock(metadata.tags.ImageDescription);
                        res.json(FILENAME_RESPONSE_MOCKS[responseMock] || FILENAME_RESPONSE_MOCKS.default);
                        return;
                    }
                    res.json(FILENAME_RESPONSE_MOCKS.default);
                } catch (error) {
                    console.error('Error:', error);
                    res.status(500).json({error: "Invalid file format. Cannot open."});
                }
            }
        });
    });
    req.pipe(bb);
});

function shutDown() {
    console.log("Received kill signal, shutting down");
    process.exit(0);
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Mindreader is running on port ${port}`);
});
