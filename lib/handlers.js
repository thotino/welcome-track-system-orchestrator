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
const Promise = global.Promise = require("bluebird");
const elasticsearchHandler = require("elasticsearch-helper");
const errors = require("restify-errors");
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
module.exports.getIndexInfos = function(req, res, next) {
    return elasticsearchHandler.helpers.getInfos()
        .then((data) => { res.data = data; return next(); })
        .catch((error) => { return next( new errors.InternalServerError("Retry later or contact support") ); });
};

module.exports.deleteIndex = function(req, res, next) {
    return elasticsearchHandler.helpers.deleteIndex()
        .then((data) => { res.data = data; return next(); })
        .catch((error) => { return next( new errors.InternalServerError("Retry later or contact support") ); });
};

module.exports.retrieveAllEntries = function(req, res, next) {
    return elasticsearchHandler.helpers.getAllDocs()
        .then((data) => { res.data = data; return next(); })
        .catch((error) => {console.log(error); return next( new errors.InternalServerError("Retry later or contact support") ); });
};

module.exports.retrieveEntry = function(req, res, next) {
    return elasticsearchHandler.helpers.getDocument(req.params.id)
        .then((data) => { res.data = data; return next(); })
        .catch((error) => { return next( new errors.InternalServerError("Retry later or contact support") ); });
};

exports.sendData = function sendData(req, res, next) {
    res.header("Connection", "close");
    res.status(200);
    res.json(res.data);
    return next();
};