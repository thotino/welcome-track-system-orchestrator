import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import logger from "../logging.js";

export type ElasticsearchConfig = {
    nodes: string[];
    auth: {
        username: string;
        password: string;
    };
    index: string;
    logLevel: string;
};
export default class ElasticsearchConnector {
    readonly client: ElasticsearchClient;
    constructor(config: ElasticsearchConfig) {
        this.client = new ElasticsearchClient({
            node: config.nodes[0],
            auth: {
                username: config.auth.username,
                password: config.auth.password,
            },
            index: config.index,
            logLevel: config.logLevel,
        });
    }
    async connect() {
        try {
            await this.client.ping();
            logger.info("Elasticsearch client connected successfully");
        } catch (error) {
            logger.error("Elasticsearch client connection failed", error);
            throw error;
        }
    
    }

    async close() {
        await this.client.close();
        logger.info("Elasticsearch client closed");
    }
}