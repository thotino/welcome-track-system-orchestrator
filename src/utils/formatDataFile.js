/**
 * project JSDoc description
 * @module {Object} module name
 * @version 1.0.0
 * @author Thotino GOBIN-GANSOU
 * @requires bluebird
 * @requires fast-csv/parse
 * @requires fs-extra
 */

"use strict";

//= ===============================================================================
// dependencies
//= ===============================================================================
const fs = require("node:fs");
const { createInterface } = require("node:readline/promises");

//= ===============================================================================
// config
//= ===============================================================================
/** import here configurations */

//= ===============================================================================
// aliases
//= ===============================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//= ===============================================================================
// module
//= ===============================================================================
/**
 * @function parseFile
 * @description Read a file as a stream, parse and returns an array of objects
 * @param {String} fileAbsolutePath
 * @param {String} columnsSeparator
 * @returns {*} - a promise of array of objects
 */
module.exports.parseFile = async function* (
    fileAbsolutePath,
    columnsSeparator = ";",
) {
    const fileStream = fs.createReadStream(fileAbsolutePath);
    const lineInterface = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    for await (const line of lineInterface) {
        yield line;
    }
};
