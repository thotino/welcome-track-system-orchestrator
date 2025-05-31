/**
 * project JSDoc description
 * @module {Object} statics
 * @version 1.0.0
 * @author Thotino GOBIN-GANSOU
 * @requires bluebird
 * @requires elasticsearch
 * @requires fs-extra
 * @requires path
 */

//================================================================================
// dependencies
//================================================================================
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";

//================================================================================
// config
//================================================================================
import config from "../config";
const configElasticsearch = config.connections.elasticsearch;

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
type Item = {
        index: {
            _index: string;
            _type: string;
            _id: string;};
            [key: string]: unknown ;
    }

export default class ElasticsearchStatics {
    private esClient: ElasticsearchClient;
    private defaultIndex: string;

    constructor() {
        this.esClient = new ElasticsearchClient(configElasticsearch);
        this.defaultIndex = configElasticsearch.index;
    }

    // /**
    //  * Add an object to the index
    //  */
    // async addObjectToIndex(
    //     data: any,
    //     idFields: string[] = ["id"],
    //     targetIndex: string = this.defaultIndex,
    // ) {
    //     let assignedId = "";
    //     idFields.forEach(curField => {
    //         if (Object.prototype.hasOwnProperty.call(data, curField)) {
    //             assignedId += data[curField];
    //         }
    //     });

    //     return this.esClient.create({
    //         id: assignedId !== "" ? assignedId : Date.now(),
    //         index: targetIndex,
    //         body: data,
    //         type: "_doc",
    //     });
    // }

    /**
     * Index an object
     */
    async indexObject(data: any, targetIndex: string = this.defaultIndex) {
        return this.esClient.index({
            id: Date.now().toString(),
            index: targetIndex,
            body: data,
            type: "_doc",
        });
    }

    /**
     * Get index infos
     */
    async getInfos(targetIndex: string = this.defaultIndex) {
        return this.esClient.cat.indices({
            index: targetIndex,
            format: "json",
            v: true,
        });
    }

    /**
     * Get all documents
     */
    async getAllDocs(
        offset: number = 0,
        limit: number = 100,
        targetIndex: string = this.defaultIndex,
    ) {
        return await this.esClient.search({
            index: targetIndex,
            type: "_doc",
            from: offset,
            size: limit,
            body: { query: { match_all: {} } },
        });
    }

    // /**
    //  * Get documents from offset
    //  */
    // async getDocsFromOffset(
    //     offset: number = 0, limit: number = 100,
    //     targetIndex: string = this.defaultIndex,
    // ) {
    //     return await this.esClient.search({
    //         index: targetIndex,
    //         type: "_doc",
    //         from: offset, size: limit,
    //         body: { query: { match_all: {} } },
    //     });
    // }

    /**
     * Count all documents
     */
    async countAllDocs(targetIndex: string = this.defaultIndex) {
        return this.esClient.count({
            index: targetIndex,
            type: "_doc",
            body: { query: { match_all: {} } },
        });
    }

    /**
     * Get a document by ID
     */
    async getDocument(
        targetID: string,
        targetIndex: string = this.defaultIndex,
    ) {
        return this.esClient.get({
            index: targetIndex,
            id: targetID,
            type: "_doc",
        });
    }

    /**
     * Bulk index documents
     */
    async bulkIndex(
        type: string,
        data: any[],
        index: string = this.defaultIndex,
    ) {
        const bulkBody: Item[] = [];
        data.forEach(item => {
            bulkBody.push({
                index: {
                    _index: index,
                    _type: type,
                    _id: item.id ? item.id : Date.now(),
                },
            });
            bulkBody.push(item);
        });

        return this.esClient.bulk({
            index: index,
            body: bulkBody,
        });
    }

    /**
     * Bulk index for WelcomeTrack data (INTERNAL USE ONLY)
     */
    async bulkIndexForWelcomeTrackData(
        type: string,
        data: any[],
        index: string = this.defaultIndex,
    ) {
        const identifier = "ID (Livraison)";
        const bulkBody: Item[] = [];
        data.forEach(item => {
            bulkBody.push({
                index: {
                    _index: index,
                    _type: type,
                    _id: item[identifier] ?? Date.now(),
                },
            });
            bulkBody.push(item);
        });

        return this.esClient.bulk({
            index: index,
            body: bulkBody,
        });
    }

    /**
     * Delete an index
     */
    async deleteIndex(index: string = this.defaultIndex) {
        return this.esClient.indices.delete({ index });
    }
}
