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

"use strict";

//================================================================================
// dependencies
//================================================================================
const elasticsearch = require("@elastic/elasticsearch");
const path = require("node:path");

//================================================================================
// config
//================================================================================
const configElasticsearch = require(
    path.resolve(__dirname, "../conf/config-elasticsearch.json"),
);

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
const esClient = new elasticsearch.Client(configElasticsearch);

/**
 * @function addObjectToIndex
 * @param {*} data - Object to index
 * @param {*} idFields - Array of fields
 * @param {*} targetIndex - Index
 * @returns {*} - data indexed
 */
module.exports.addObjectToIndex = function addObjectToIndex(
    data,
    idFields,
    targetIndex = configElasticsearch.index,
) {
    let assignedId = "";
    idFields.forEach(curField => {
        if (data.hasOwnProperty(curField)) {
            assignedId += data[curField];
        }
    });

    return esClient.create({
        id: assignedId !== "" ? assignedId : Date.now(),
        index: targetIndex,
        body: data,
        type: "_doc",
    });
};

/**
 * @function indexObject
 * @param {*} data - Object to index
 * @param {*} targetIndex - The index
 * @returns {*} - The response of indexing data
 */
module.exports.indexObject = function indexObject(
    data,
    targetIndex = configElasticsearch.index,
) {
    return esClient.index({
        id: Date.now(),
        index: targetIndex,
        body: data,
        type: "_doc",
    });
};

/**
 * @function getInfos
 * @param {*} targetIndex - Index
 * @returns {*} - An object containing all informations in the JSON format
 */
module.exports.getInfos = function getInfos(
    targetIndex = configElasticsearch.index,
) {
    return esClient.cat.indices({
        index: targetIndex,
        format: "json",
        v: true,
    });
};

/**
 * @function getAllDocs
 * @param {*} targetIndex - The index
 * @returns {*} - The documents returned
 */
module.exports.getAllDocs = function getAllDocs(
    targetIndex = configElasticsearch.index,
) {
    return esClient.search({
        index: targetIndex,
        type: "_doc",
        body: { query: { match_all: {} } },
    });
};

/**
 * @function getDocsFromOffset
 * @param {Number} offset - The starting offset
 * @param {*} targetIndex - The index
 * @returns {*} - The documents returned
 */
module.exports.getDocsFromOffset = function getDocsFromOffset(
    offset,
    targetIndex = configElasticsearch.index,
) {
    return esClient.search({
        index: targetIndex,
        type: "_doc",
        from: offset,
        body: { query: { match_all: {} } },
    });
};

/**
 * @function countAllDocs
 * @param {*} targetIndex - The index
 * @returns {*} - The documents returned
 */
module.exports.countAllDocs = function countAllDocs(
    targetIndex = configElasticsearch.index,
) {
    return esClient.count({
        index: targetIndex,
        type: "_doc",
        body: { query: { match_all: {} } },
    });
};

/**
 * @function getDocument
 * @param {*} targetID - The id of the document to look for
 * @param {*} targetIndex - The index of documents
 * @returns {*} - The document returned
 */
module.exports.getDocument = function getDocument(
    targetID,
    targetIndex = configElasticsearch.index,
) {
    return esClient.get({
        index: targetIndex,
        id: targetID,
        type: "_doc",
    });
};

/**
 * @function bulkIndex
 * @param {*} type - data type
 * @param {*} data - array of data
 * @returns {*} - The results of the bulk index operation
 */
module.exports.bulkIndex = function bulkIndex(
    type,
    data,
    index = configElasticsearch.index,
) {
    const bulkBody = [];
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

    return esClient
        .bulk({
            index: index,
            body: bulkBody,
        })
        .then(response => {
            console.log(response);
            return response;
        })
        .catch(console.error);
};

/**
 * INTERNAL USE ONLY
 * @function bulkIndexForWelcomeTrackData
 * @param {*} type - data type
 * @param {*} data - array of data
 * @returns {*} - The results of the bulk index operation
 */
module.exports.bulkIndexForWelcomeTrackData =
    function bulkIndexForWelcomeTrackData(
        type,
        data,
        index = configElasticsearch.index,
    ) {
        const identifier = "ID (Livraison)";
        const bulkBody = [];
        data.forEach(item => {
            bulkBody.push({
                index: {
                    _index: index,
                    _type: type,
                    _id: item[identifier] ? item[identifier] : Date.now(),
                },
            });
            bulkBody.push(item);
        });

        return esClient
            .bulk({
                index: index,
                body: bulkBody,
            })
            .then(response => {
                console.log(response);
                return response;
            })
            .catch(console.error);
    };

/**
 * @function deleteIndex
 * @param {*} index - The index to delete
 * @returns {*} - The result of the delete operation
 */
module.exports.deleteIndex = function deleteIndex(
    index = configElasticsearch.index,
) {
    return esClient.indices
        .delete({ index: index })
        .then(resp => {
            return resp;
        })
        .catch(err => {
            throw err;
        });
};
