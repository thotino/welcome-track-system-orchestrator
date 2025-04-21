"use strict";
const winston = require("winston");
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.errors(),
    ),
    transports: [new winston.transports.Console()],
});
const fastifyLogger = winston.createLogger({
    level: "warn",
    levels: Object.assign(
        { fatal: 0, warn: 4, trace: 7 },
        winston.config.syslog.levels,
    ),
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.errors(),
    ),
    transports: [new winston.transports.Console()],
});

fastifyLogger.child = function () {
    return fastifyLogger;
};

module.exports = logger;
module.exports.fastifyLogger = fastifyLogger;
