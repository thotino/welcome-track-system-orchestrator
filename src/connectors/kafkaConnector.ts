// TODO: Implement Kafka connector logic
import kafka from "kafka-node";
import logger from "../logging.js";

export type KafkaConfig = {
    host: string;
    clientId: string;
    groupId: string;
    topics: string[];
}

export default class KafkaConnector {
    readonly producer: kafka.ProducerStream;
    readonly consumer: kafka.ConsumerGroupStream;

    constructor(config: KafkaConfig) {
        this.producer = new kafka.ProducerStream({
            kafkaClient: {
                kafkaHost: config.host ?? "localhost:9092", // Adresse du broker Kafka
                clientId: config.clientId ?? "my-producer-client", // Identifiant du client
                // ...autres options du KafkaClient
            },
            producer: {
                requireAcks: 1, // Nombre d'acks requis (0, 1, -1)
                ackTimeoutMs: 100, // Timeout pour les acks
                partitionerType: 2, // Type de partitionnement
                // ...autres options du Producer
            },
        });
        this.consumer = new kafka.ConsumerGroupStream(
            {
                kafkaHost: config.host ?? "localhost:9092", // Adresse du broker Kafka
                groupId: config.groupId ?? "my-consumer-group", // Nom du groupe de consommateurs
                sessionTimeout: 15000, // Timeout de session
                protocol: ["roundrobin"], // Protocole de répartition
                fromOffset: "latest", // 'earliest' ou 'latest'
                encoding: "utf8", // Encodage des messages
                autoCommit: true, // Commit auto des offsets
                // ...autres options disponibles
            },
            config.topics || []
        ); // Liste des topics à consommer
    }

    async connect() {
        this.producer.on("ready", () => {
            logger.info("Kafka producer is ready")});
        await this.consumer.client.on("ready", () => {
            logger.info("Kafka consumer is ready");})
    }
    async close() {
        await this.producer.close();
        await this.consumer.close();
    }
}
