import { kafkaConnector } from "../connectors";
import { Transform } from "stream";
import logger from "../logging";

export default class MessagesRepository {
    static async sendMessage(topic: string, message: string) {
        const messageTransform = new Transform({
            objectMode: true,
            decodeStrings: true,
            transform(message, encoding, callback) {
                logger.info(
                    `Received message ${message.value} transforming input`,
                );
                callback(null, {
                    topic,
                    messages: `You have been (${message.value}) made an example of`,
                });
            },
        });

        kafkaConnector.consumer.pipe(messageTransform).pipe(kafkaConnector.producer);
    }
}
