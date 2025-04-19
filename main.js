"use strict";

const { spawn } = require("child_process");
const logger = require("./src/logging");

const produceProcess = spawn("node", ["produce.js", "data/Export5045.csv"]);

const consumeProcess = spawn("node", ["consume.js"]);
/*
produceProcess.stdout.on("data", (data) => { console.log("PRODUCER INFO: " + data.toString()); });

produceProcess.stderr.on("data", (data) => { console.log("PRODUCER ERR: " + data.toString()); });
*/
consumeProcess.stdout.on("data", data => {
    logger.info(`CONSUMER INFO: ${data.toString()}`);
});

consumeProcess.stderr.on("data", data => {
    logger.info(`CONSUMER ERR: ${data.toString()}`);
});
