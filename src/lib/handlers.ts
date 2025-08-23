/**
 * project JSDoc description
 * @module {Object} module name
 * @version 1.0.0
 * @author author name
 * @requires dependency 1
 * @requires dependency 2
 * ...
 */


import { FastifyReply, FastifyRequest } from "fastify";

//================================================================================
// dependencies
//================================================================================
import IndicesService from "../services/indices.js";    
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
interface IndexRequestParams {
    params: {
        index: string;
    };
}
async function countIndexDocuments(
    request: FastifyRequest & IndexRequestParams,
    reply: FastifyReply,
) {
    const {
        body: { count },
    } = await IndicesService.countAllDocs(request.params.index);
    return reply.status(200).send(count);
}

async function getIndexInfos(
    request: FastifyRequest & IndexRequestParams,
    reply: FastifyReply,
) {
    const data = await IndicesService.getInfos(request.params.index);
    return reply.status(200).send(data);
}

async function deleteIndex(
    request: FastifyRequest & IndexRequestParams,
    reply: FastifyReply,
) {
    const data = await IndicesService.deleteIndex(request.params.index);
    return reply.status(200).send(data);
}
function formatEntry(entry: any) {
    return entry._source;
}
async function retrieveAllEntries(
    request: FastifyRequest & PaginationRequestParams,
    reply: FastifyReply,
) {
    const data = await IndicesService.getAllDocs();
    const docs = data.body.hits.hits.map(formatEntry);
    return reply.status(200).send(docs);
}

interface PaginationRequestParams {
    params: { offset: number; limit: number };
}
async function retrieveAllEntriesFromOffset(
    request: FastifyRequest & PaginationRequestParams,
    reply: FastifyReply,
) {
    const data = await IndicesService.getDocsFromOffset(
        request.params.offset,
        request.params.limit,
    );
    const docs = data.body.hits.hits.map(formatEntry);
    return reply.status(200).send(docs);
}
interface SingleEntryRequestParams {
    params: {
        id: string;
    };
}
async function retrieveSingleEntryById(
    request: FastifyRequest & SingleEntryRequestParams,
    reply: FastifyReply,
) {
    const data = await IndicesService.getDocument(request.params.id);
    return reply.status(200).send(data.body._source);
}

export default {
    countIndexDocuments,
    getIndexInfos,
    deleteIndex,
    retrieveAllEntries,
    retrieveAllEntriesFromOffset,
    retrieveSingleEntryById,
};
