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
const restify = require("restify");

const dataHandlers = require("./lib/handlers");
const fs = require("node:fs");
//================================================================================
// config
//================================================================================
const serverConf = fs.readJsonSync("./conf/properties.json").server;

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
const server = restify.createServer({});

server.get("/", (req, res) => {
    res.send("Hello world!");
});

/*
 * Endpoint to get index infos
 */
server.get("/index/:index", [
    dataHandlers.validateHeaderAcceptJson,
    dataHandlers.getIndexInfos,
    dataHandlers.sendData,
]);

/*
 * Endpoint to get index documents count
 */
server.get("/index/:index/count", [
    dataHandlers.validateHeaderAcceptJson,
    dataHandlers.countIndexDocuments,
    dataHandlers.sendData,
]);

/*
 * Endpoint for all documents retrieval
 */
server.get("/docs", [
    dataHandlers.validateHeaderAcceptJson,
    dataHandlers.retrieveAllEntries,
    dataHandlers.sendData,
]);

/*
 * Endpoint for all documents retrieval from an offset
 */
server.get("/docs/:offset", [
    dataHandlers.validateHeaderAcceptJson,
    dataHandlers.retrieveAllEntriesFromOffset,
    dataHandlers.sendData,
]);

/*
 * Endpoint to retrieve  single document by Id
 */
server.get("/doc/:id", [
    dataHandlers.validateHeaderAcceptJson,
    dataHandlers.retrieveEntry,
    dataHandlers.sendData,
]);

/*
 * Endpoint to delete entire index
 */
server.del("/index/:index", [
    dataHandlers.validateHeaderAcceptJson,
    dataHandlers.deleteIndex,
    dataHandlers.sendData,
]);

server.listen(
    serverConf.port,
    serverConf.host,
    console.log(`listening to the port ${serverConf.port}...`),
);
