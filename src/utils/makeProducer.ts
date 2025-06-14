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
import logger from "../logging";
import config from "../config";

//================================================================================
// config
//================================================================================
const configKafka = config.connections.kafka;

//================================================================================
// aliases
//================================================================================
const Producer = kafka.Producer;
const Client = kafka.KafkaClient;

//================================================================================
// module
//================================================================================
//TODO: use https://www.npmjs.com/package/kafka-node#producerstream
export default class KafkaProducer {
    private client: kafka.KafkaClient;
    private producer: kafka.Producer;

    constructor() {
        this.client = new Client(configKafka.options);
        this.producer = new Producer(this.client);

        this.producer.on("ready", () => {
            logger.info("producer ready");
        });
        this.producer.on("error", error => {
            throw error;
        });
    }

    /**
     * Checks the existence of the topic. It is created if it doesn't exist.
     * @param topicName The name of the topic
     */
    async createCurrentTopic(
        topicName: string = configKafka.defaultTopic,
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.loadMetadataForTopics([topicName], (err, result) => {
                if (err) {
                    return reject(err);
                }
                logger.info(result);
                resolve(result);
            });
        });
    }

    /**
     * Sends a single message to the topic.
     * @param message The message as an object
     * @param topicName The name of the topic
     */
    async sendSingleRequest(
        message: object,
        topicName: string = configKafka.defaultTopic,
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this.producer.send(
                [
                    {
                        topic: topicName,
                        messages: JSON.stringify(message),
                    },
                ],
                (error, data) => {
                    if (error) {
                        logger.error(error);
                        return reject(error);
                    }
                    logger.info(data);
                    resolve(data);
                },
            );
        });
    }
}
