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

const jsonRegExp = /application\/json|\*\/\*/;
module.exports.validateHeaderAcceptJson = function (req, res, next) {
  if (req.headers.accept && !jsonRegExp.test(req.headers.accept)) {
    return next(new errors.NotAcceptableError("allowed accept header: application/json"));
  }
  return next();
};

module.exports.countIndexDocuments = function (req, res, next) {
  return elasticsearchHandler.helpers.countAllDocs(req.params.index)
    .then((data) => { return {count: data.body.count}; })
    .then((data) => { res.data = data; return next(); })
    .catch((error) => { console.log(error); return next(new errors.InternalServerError("Retry later or contact support")); });
};

module.exports.getIndexInfos = function (req, res, next) {
  return elasticsearchHandler.helpers.getInfos(req.params.index)
    .then((data) => { res.data = data; return next(); })
    .catch((error) => { console.log(error); return next(new errors.InternalServerError("Retry later or contact support")); });
};

module.exports.deleteIndex = function (req, res, next) {
  return elasticsearchHandler.helpers.deleteIndex(req.params.index)
    .then((data) => { res.data = data; return next(); })
    .catch((error) => { console.log(error); return next(new errors.InternalServerError("Retry later or contact support")); });
};

module.exports.retrieveAllEntries = function (req, res, next) {
  return elasticsearchHandler.helpers.getAllDocs()
    .then((data) => { console.log(data.body); return data.body.hits.hits.map((entry) => { return entry._source; }); })
    .then((data) => { res.data = data; return next(); })
    .catch((error) => { console.log(error); return next(new errors.InternalServerError("Retry later or contact support")); });
};

module.exports.retrieveAllEntriesFromOffset = function (req, res, next) {
  return elasticsearchHandler.helpers.getDocsFromOffset(req.params.offset)
    .then((data) => { return data.body.hits.hits.map((entry) => { return entry._source; }); })
    .then((data) => { res.data = data; return next(); })
    .catch((error) => { console.log(error); return next(new errors.InternalServerError("Retry later or contact support")); });
};

module.exports.retrieveEntry = function (req, res, next) {
  return elasticsearchHandler.helpers.getDocument(req.params.id)
    .then((data) => { return data.body._source; })
    .then((data) => { res.data = data; return next(); })
    .catch((error) => { console.log(error); return next(new errors.InternalServerError("Retry later or contact support")); });
};

exports.sendData = function sendData(req, res, next) {
  res.header("Connection", "close");
  res.status(200);
  res.json(res.data);
  return next();
};
