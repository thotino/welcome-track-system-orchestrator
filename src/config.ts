import config from "config";
import type { KafkaConfig } from "./connectors/kafkaConnector";
import type { ElasticsearchConfig } from "./connectors/elasticsearchConnector";
type WebServerConf = { port: number; host: string };
type ConnectionsConf = {
    elasticsearch: ElasticsearchConfig;
    kafka: KafkaConfig;
    zookeeper: { host: string; port: number; dataDir: string };
};
type ServiceConf = { name: string; logging: { level: string; file: string } };

export default {
    webserver: config.get("webserver") as WebServerConf,
    connections: config.get("connections") as ConnectionsConf,
    service: config.get("service") as ServiceConf,
};
