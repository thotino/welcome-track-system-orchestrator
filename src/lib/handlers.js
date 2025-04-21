/**
 * project JSDoc description
 * @module {Object} module name
 * @version 1.0.0
 * @author author name
 * @requires dependency 1
 * @requires dependency 2
 * ...
 */

"use strict";

const logger = require("../logging");
//================================================================================
// dependencies
//================================================================================
const elasticsearchHandler = require("../utils/statics");

//================================================================================
// config
//================================================================================
/** import here configurations */

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
module.exports.countIndexDocuments = async function (request, reply) {
    const {
        body: { count },
    } = await elasticsearchHandler.countAllDocs(request.params.index);
    return reply.status(200).json(count);
};

module.exports.getIndexInfos = async function (request, reply) {
    const data = await elasticsearchHandler.getInfos(request.params.index)
    return reply.status(200).json(data)
};

module.exports.deleteIndex = async function (request, reply) {
    const data = await elasticsearchHandler.deleteIndex(request.params.index);
    return reply.status(200).json(data);
};

module.exports.retrieveAllEntries = async function (request, reply) {
    const data = await elasticsearchHandler.getAllDocs()
    const docs = data.body.hits.hits.map(entry => {
        return entry._source;
    });
    return reply.status(200).json(docs)
};

module.exports.retrieveAllEntriesFromOffset = async function (request, reply) {
    const data = await elasticsearchHandler
        .getDocsFromOffset(request.params.offset)
    const docs = data.body.hits.hits.map(entry => {
        return entry._source;
    });
    return reply.status(200).json(docs)
};

module.exports.retrieveEntry = async function (request, reply) {
    const {body: {_source: data}} = await elasticsearchHandler.getDocument(request.params.id)
    return reply.status(200).json(data)
};
