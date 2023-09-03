const express = require("express");
const busboy = require('busboy');
const cors = require('cors');

const FILENAME_RESPONSE_MOCKS = {
    construction: {
        "objects": [
            {
                "label": "Construction Workers",
                "probability": .87,
                "bounding_box": {
                    "top": 465,
                    "left": 315,
                    "bottom": 280,
                    "right": 740
                }
            },
            {
                "label": "Digger",
                "probability": .67,
                "bounding_box": {
                    "top": 430,
                    "left": 110,
                    "bottom": 500,
                    "right": 350
                }
            },
            {
                "label": "Digger",
                "probability": .69,
                "bounding_box": {
                    "top": 420,
                    "left": 350,
                    "bottom": 498,
                    "right": 450
                }
            },
            {
                "label": "Digger",
                "probability": .86,
                "bounding_box": {
                    "top": 380,
                    "left": 590,
                    "bottom": 480,
                    "right": 820
                }
            },
            {
                "label": "Sunset",
                "probability": .98,
                "bounding_box": {
                    "top": 300,
                    "left": 350,
                    "bottom": 520,
                    "right": 800
                }
            },
        ]
    },
    convention: {
        "objects": [
            {
                "label": "TV",
                "probability": .98,
                "bounding_box": {
                    "top": 450,
                    "left": 460,
                    "bottom": 480,
                    "right": 575
                }
            },
            {
                "label": "Couch",
                "probability": .44,
                "bounding_box": {
                    "top": 600,
                    "left": 0,
                    "bottom": 0,
                    "right": 490
                }
            },
            {
                "label": "Show Lights",
                "probability": .60,
                "bounding_box": {
                    "top": 10,
                    "left": 300,
                    "bottom": 750,
                    "right": 1024
                }
            },
        ]
    },
    countryside: {
        "objects": [
            {
                "label": "Hut",
                "probability": .32,
                "bounding_box": {
                    "top": 210,
                    "left": 490,
                    "bottom": 440,
                    "right": 1015
                }
            },
            {
                "label": "Stork",
                "probability": .93,
                "bounding_box": {
                    "top": 745,
                    "left": 690,
                    "bottom": 20,
                    "right": 900
                }
            },
        ]
    },
    electronics: {
        "objects": [
            {
                "label": "Engineer",
                "probability": .78,
                "bounding_box": {
                    "top": 405,
                    "left": 600,
                    "bottom": 20,
                    "right": 980
                }
            },
            {
                "label": "Robot",
                "probability": .99,
                "bounding_box": {
                    "top": 130,
                    "left": 72,
                    "bottom": 427,
                    "right": 333
                }
            },
            {
                "label": "Robot",
                "probability": .99,
                "bounding_box": {
                    "top": 160,
                    "left": 580,
                    "bottom": 440,
                    "right": 938
                }
            },
        ]
    },
    street: {
        "objects": [
            {
                "label": "Tram",
                "probability": .12,
                "bounding_box": {
                    "top": 410,
                    "left": 123,
                    "bottom": 150,
                    "right": 625
                }
            },
            {
                "label": "Car",
                "probability": .39,
                "bounding_box": {
                    "top": 666,
                    "left": 711,
                    "bottom": 300,
                    "right": 800
                }
            },
            {
                "label": "Pedestrian",
                "probability": .51,
                "bounding_box": {
                    "top": 651,
                    "left": 820,
                    "bottom": 170,
                    "right": 905
                }
            },
        ]
    },
    default: {
        "objects": []
    }
};

const app = express();
app.use(express.json());
app.use(express.text());
app.use(cors())

function getResponseMock(filename) {
    if (!filename) {
        return "default";
    }
    if (filename.includes('construction')) {
        return "construction";
    }
    if (filename.includes('convention')) {
        return "convention";
    }
    if (filename.includes('countryside')) {
        return "countryside";
    }
    if (filename.includes('electronics')) {
        return "electronics";
    }
    if (filename.includes('street')) {
        return "street";
    }
    return "default";
}

app.post("/recognize", (req, res) => {

    const bb = busboy({headers: req.headers});
    let responseMock = 'default';
    let receivedData = false;
    bb.on('file', (name, file, info) => {
        if (info.filename.includes('test_error')) {
            res.status(500).json({error: "Test error. You just entered something which provokes a test error."});
            return;
        }
        responseMock = getResponseMock(info.filename);
        file.on('data', (data) => {
            receivedData = receivedData || data.length > 0;
        }).on('close', () => {
            if (receivedData) {
                res.json(FILENAME_RESPONSE_MOCKS[responseMock] || FILENAME_RESPONSE_MOCKS.default);
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
