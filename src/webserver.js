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

//================================================================================
// dependencies
//================================================================================
const fastify = require("fastify");

const dataHandlers = require("./lib/handlers");
//================================================================================
// config
//================================================================================
const { server: serverConf } = require("../conf/properties.json");
const logger = require("./logging");

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
const server = fastify({ loggerInstance: logger.fastifyLogger });

server.get("/", (req, res) => {
    res.send("Hello world!");
});

/*
 * Endpoint to get index infos
 */
server.get("/index/:index", async (request, reply) => {
    await dataHandlers.getIndexInfos(request, reply);
});

/*
 * Endpoint to get index documents count
 */
server.get("/index/:index/count", async (request, reply) => {
    await dataHandlers.countIndexDocuments(request, reply);
});

/*
 * Endpoint for all documents retrieval
 */
server.get("/docs", async (request, reply) => {
    await dataHandlers.retrieveAllEntries(request, reply);
});

/*
 * Endpoint for all documents retrieval from an offset
 */
server.get("/docs/:offset", async (request, reply) => {
    await dataHandlers.retrieveAllEntriesFromOffset(request, reply);
});

/*
 * Endpoint to retrieve  single document by Id
 */
server.get("/doc/:id", async (request, reply) => {
    await dataHandlers.retrieveEntry(request, reply);
});

/*
 * Endpoint to delete entire index
 */
server.delete("/index/:index", async (request, reply) => {
    await dataHandlers.deleteIndex(request, reply);
});

server.listen({
    port: serverConf.port,
    host: serverConf.host,
});
