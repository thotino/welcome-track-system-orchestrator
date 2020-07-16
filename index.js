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
// const utils = require("./lib/util");
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
const server = restify.createServer({});

server.get("/index", [
    // utils.validateHeaderAcceptJson,
    dataHandlers.getIndexInfos,
    dataHandlers.sendData,
]);

server.del("/index", [
    // utils.validateHeaderAcceptJson,
    dataHandlers.deleteIndex,
    dataHandlers.sendData,
]);

server.get("/doc/list", [
    // utils.validateHeaderAcceptJson,
    dataHandlers.retrieveAllEntries,
    dataHandlers.sendData,
]);

server.get("/doc/:id", [
    // utils.validateHeaderAcceptJson,
    dataHandlers.retrieveEntry,
    dataHandlers.sendData,
]);

server.listen(1200, console.log("listening to the port 1200..."));