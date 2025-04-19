/**
 * project JSDoc description
 * @module {Object} makeConsumer
 * @version 1.0.0
 * @author Thotino GOBIN-GANSOU
 * @requires kafka-node
 * @requires fs-extra
 * @requires path
 * @requires elasticsearch-helper
 */

"use strict";

//================================================================================
// dependencies
//================================================================================
const kafka = require("kafka-node");
const path = require("node:path");
const elasticsearchHandler = require("./statics");
const logger = require("../logging");

//================================================================================
// config
//================================================================================
const configKafka = require(
    path.resolve(__dirname, "../conf/config-kafka.json"),
);

//================================================================================
// aliases
//================================================================================
const Consumer = kafka.Consumer;
const Offset = kafka.Offset;

//================================================================================
// module
//================================================================================
const client = new kafka.KafkaClient(configKafka.options);
const offset = new Offset(client);

client.on("ready", () => {
    logger.info("client ready!");
});
const allMessages = [];

/**
 * @function fromQueueToIndex
 * @description This function creates the consumer that reads the given topic
 * @param {*} topicName - The name of the topic
 */
module.exports.fromQueueToIndex = function fromQueueToIndex(
    topicName = configKafka.defaultTopic,
) {
    const topicConsumer = new Consumer(client, [], { fromOffset: true });

    topicConsumer.on("message", message => {
        logger.info(message.value);
        allMessages.push(JSON.parse(message.value));
        if (message.offset == message.highWaterOffset - 1) {
            elasticsearchHandler.helpers
                .bulkIndexForWelcomeTrackData("_doc", allMessages)
                .then(result => {
                    logger.info(result);
                });
        }
    });

    topicConsumer.on("error", error => {
        if (error) {
            throw error;
        }
    });

    topicConsumer.on("offsetOutOfRange", topic => {
        topic.maxNum = 2;

        offset.fetch([topic], (err, offsets) => {
            if (err) {
                logger.error(err);
            }

            const min = Math.min(offsets[topic.topic][topic.partition]);
            topicConsumer.setOffset(topic.topic, topic.partition, min);
        });
    });

    topicConsumer.addTopics([
        {
            topic: topicName,
            partition: 0,
            offset: 0,
        },
    ]);
};

/**
 * @function receiveMessages
 * @param {*} topicName - The name of the topic
 * @returns {*} - a promise
 */
module.exports.receiveMessages = function receiveMessages(
    topicName = configKafka.defaultTopic,
) {
    return new Promise((resolve, reject) => {
        const topicConsumer = new Consumer(client, [
            { topic: topicName, partition: 0 },
        ]);

        topicConsumer.on("message", message => {
            logger.info(message.value);
            return resolve(JSON.parse(message.value));
        });

        topicConsumer.on("error", error => {
            return reject(error);
        });

        topicConsumer.on("offsetOutOfRange", error => {
            return reject(error);
        });
    });
};
