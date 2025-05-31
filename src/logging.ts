import pino from "pino";

// Logger général avec format JSON (par défaut)
const logger = pino({
    level: "info",
    formatters: {
        level(label) {
            return { level: label };
        }
    },
    timestamp: pino.stdTimeFunctions.isoTime
});
export default logger;

// Logger pour Fastify avec format JSON (par défaut)
export const fastifyLogger = pino({
    level: "warn",
    formatters: {
        level(label) {
            return { level: label };
        }
    },
    timestamp: pino.stdTimeFunctions.isoTime
});
