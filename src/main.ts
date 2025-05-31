import WebServer from "./webserver";
import { spawn } from "child_process";
import logger from "./logging";

async function setup() {
const produceProcess = spawn("node", ["produce.ts", "data/Export5045.csv"]);
const consumeProcess = spawn("node", ["consume.ts"]);

produceProcess.stdout.on("data", data => {
    logger.info(`PRODUCER INFO: ${data.toString()}`);
});
produceProcess.stderr.on("data", data => {
    logger.error(`PRODUCER ERR: ${data.toString()}`);
});

consumeProcess.stdout.on("data", data => {
    logger.info(`CONSUMER INFO: ${data.toString()}`);
});
consumeProcess.stderr.on("data", data => {
    logger.error(`CONSUMER ERR: ${data.toString()}`);
});
}
async function main() {    
    const webServer = new WebServer();
    await webServer.start();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(err => {
        logger.error("Error starting the server: %s", err.message);
        process.exit(1);
    });
}