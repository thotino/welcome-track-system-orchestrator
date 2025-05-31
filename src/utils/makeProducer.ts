/**
 * project JSDoc description
 * @module {Object} module name
 * @version 1.0.0
 * @author aThotino GOBIN-GANSOU
 * @requires bluebird
 * @requires kafka-node
 * @requires fs-extra
 * @requires path
 */

"use strict";

//================================================================================
// dependencies
//================================================================================
import kafka from "kafka-node";
import path from "node:path";
import logger from "../logging";

//================================================================================
// config
//================================================================================
const configKafka = require(
    path.resolve(__dirname, "../../conf/config-kafka.json"),
);

//================================================================================
// aliases
//================================================================================
const Producer = kafka.Producer;
const Client = kafka.KafkaClient;

//================================================================================
// module
//================================================================================
const client = new Client(configKafka.options);
const topicProducer = new Producer(client);

topicProducer.on("ready", () => {
    logger.info("producer ready");
});
topicProducer.on("error", error => {
    throw error;
});

/**
 * @function createCurrentTopic
 * @description - This function checks the existence of the topic. It is created if it doesn't exist.
 * @param {*} topicName - The name of the topic
 */
export function createCurrentTopic(topicName) {
    return client.loadMetadataForTopics([topicName], (err, result) => {
        if (err) {
            throw err;
        }
        logger.info(result);
    });
};

/**
 * @function sendSingleRequest
 * @param {*} message - The message as an object
 * @param {*} topicName - The name of the topic
 */
export function sendSingleRequest(
    message,
    topicName = configKafka.defaultTopic,
) {
    return topicProducer.send(
        [
            {
                topic: topicName,
                messages: JSON.stringify(message),
                timestamp: Date.now(),
                partition: 0,
            },
        ],
        (error, data) => {
            if (error) {
                logger.error(error);
            }
            logger.info(data);
        },
    );
};
