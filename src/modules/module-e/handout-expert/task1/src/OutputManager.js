class OutputManager {
    /**
     *
     * @param {string} message
     * @param {'red'|'green'?} color
     */
    display(message, color) {
        if (color === "red") {
            console.log("\x1b[31m%s\x1b[0m", message);
        } else if (color === "green") {
            console.log("\x1b[32m%s\x1b[0m", message);
        } else {
            console.log(message);
        }
    }
}

module.exports = { OutputManager };
