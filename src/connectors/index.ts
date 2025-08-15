import config from "../config.js";
import ElasticsearchConnector from "./elasticsearchConnector.js";
import KafkaConnector from "./kafkaConnector.js";

const kafkaConnector = new KafkaConnector(config.connections.kafka);
const elasticsearchConnector = new ElasticsearchConnector(config.connections.elasticsearch);

export { elasticsearchConnector, kafkaConnector };