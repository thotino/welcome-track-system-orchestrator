/**
 * project JSDoc description
 * @module {Object} produce
 * @version 1.0.0
 * @author Thotino GOBIN-GANSOU
 */

//================================================================================
// dependencies
//================================================================================
import { createReadStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ProducerStream, KafkaClient } from "kafka-node";
import { parse } from "fast-csv";
import logger from "./logging.js";
import path from "node:path";

//================================================================================
// config
//================================================================================
import config from "./config";
const configKafka = config.connections.kafka;
//================================================================================
// aliases
//================================================================================

//================================================================================
// module
//================================================================================
const dataPath =
    process.argv[2] ?? path.join(import.meta.dirname, "../data/Export5045.csv");
const transform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform(chunk, encoding, callback) {
        const line = chunk;
        callback(null, { topic: configKafka.topics.welcomeTrack, messages: line });
    },
});
const kafkaClient = new KafkaClient({
    kafkaHost: configKafka.host,
});
const kafkaProducer = new ProducerStream({kafkaClient, requireAcks: 1, ackTimeoutMs: 1000});
const csvParse = parse({
    headers: true,
    skipEmptyLines: true,
    delimiter: ";",
    ignoreEmpty: true,
    trim: true,
    quote: '"',
});
async function produceMessagesToKafkaFromFile() {
    const fileStream = createReadStream(dataPath);
    await pipeline(fileStream, csvParse, transform, kafkaProducer);
}
produceMessagesToKafkaFromFile()
    .catch((error: Error) => {
        logger.error("Error producing messages to Kafka: %s", error.message);
        process.exit(1);
    })
    .finally(async() => {
        logger.info("Finished producing messages to Kafka.");
        await kafkaProducer.close();
        await kafkaClient.close();
    }
);
