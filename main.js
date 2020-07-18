"use strict";

const Promise = global.promise = require("bluebird");

const {spawn} = require("child_process");

const produceProcess = spawn("node", ["produce.js", "data/Export5045.csv"]);

const consumeProcess = spawn("node", ["consume.js"]);
/*
produceProcess.stdout.on("data", (data) => { console.log("PRODUCER INFO: " + data.toString()); });

produceProcess.stderr.on("data", (data) => { console.log("PRODUCER ERR: " + data.toString()); });
*/
consumeProcess.stdout.on("data", (data) => { console.log(`CONSUMER INFO: ${data.toString()}`); });

consumeProcess.stderr.on("data", (data) => { console.log(`CONSUMER ERR: ${data.toString()}`); });

