import pino from "pino";
import config from "./config";
// Logger général avec format JSON (par défaut)
const logger = pino({
    level: config.service.logging.level || "info",
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});
export default logger;

// Logger pour Fastify avec format JSON (par défaut)
export const fastifyLogger = pino({
    level: config.service.logging.fastifyLevel || "info",
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});
