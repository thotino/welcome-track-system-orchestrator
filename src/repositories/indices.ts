import { elasticsearchConnector } from "../connectors/index.js";
import { logger } from "../logger.js";

type Item = {
    index: {
        _index: string;
        _type: string;
        _id: string;
    };
    [key: string]: unknown;
};
export default class IndicesRepository {
    static async createIndex(indexName: string) {
        // Implementation for creating an index in Elasticsearch
        logger.info(`Creating index: ${indexName}`);
        try {
            await elasticsearchConnector.client.createIndex(indexName);
            logger.info(`Index ${indexName} created successfully`);
        } catch (error: Error) {
            logger.error(`Error creating index ${indexName}: ${error.message}`);
            throw error;
        }
    }

    static async deleteIndex(indexName: string) {
        // Implementation for deleting an index in Elasticsearch
        logger.info(`Deleting index: ${indexName}`);
        try {
            await elasticsearchConnector.client.deleteIndex(indexName);
            logger.info(`Index ${indexName} deleted successfully`);
        } catch (error: Error) {
            logger.error(`Error deleting index ${indexName}: ${error.message}`);
            throw error;
        }
    }

    static async indexObject(data: unknown) {
        await elasticsearchConnector.client.index({
            id: Date.now().toString(),
            body: data,
            type: "_doc",
        });
    }

    static async getInfos(indexName: string) {
        // Implementation for retrieving index information
        logger.info(`Retrieving info for index: ${indexName}`);
        try {
            const response = await elasticsearchConnector.client.getIndexInfo(indexName);
            logger.info(`Index info retrieved successfully for ${indexName}`);
            return response;
        } catch (error: Error) {
            logger.error(`Error retrieving index info for ${indexName}: ${error.message}`);
            throw error;
        }
    }

    static async countDocuments(indexName: string) {
        // Implementation for counting documents in an index
        logger.info(`Counting documents in index: ${indexName}`);
        try {
            const response = await elasticsearchConnector.client.count({ index: indexName });
            logger.info(`Counted ${response.count} documents in index ${indexName}`);
            return response.count;
        } catch (error: Error) {
            logger.error(`Error counting documents in index ${indexName}: ${error.message}`);
            throw error;
        }
    }

    static async searchDocuments(
        query: Record<string, unknown>,
        indexName: string = elasticsearchConnector.client.index,
    ) {
        // Implementation for searching documents in an index
        logger.info(`Searching documents in index: ${indexName}`);
        try {
            const response = await elasticsearchConnector.client.search({
                index: indexName,
                body: { query },
            });
            logger.info(`Found ${response.hits.total.value} documents matching the query`);
            return response.hits.hits.map((hit) => hit._source);
        } catch (error: Error) {
            logger.error(`Error searching documents in index ${indexName}: ${error.message}`);
            throw error;
        }
    }

    static async bulkIndex(items: Item[]) {
        // Implementation for bulk indexing items
        logger.info(`Bulk indexing ${items.length} items`);
        try {
            const body = items.flatMap((item) => [
                { index: { _index: item.index._index, _id: item.index._id } },
                item,
            ]);
            const response = await elasticsearchConnector.client.bulk({ body });
            if (response.errors) {
                logger.error("Errors occurred during bulk indexing");
                throw new Error("Bulk indexing failed");
            }
            logger.info(`Successfully indexed ${items.length} items`);
            return response;
        } catch (error: Error) {
            logger.error(`Error during bulk indexing: ${error.message}`);
            throw error;
        }
    }
}
