/**
 * project JSDoc description
 * @module {Object} produce
 * @version 1.0.0
 * @author Thotino GOBIN-GANSOU
 * @requires bluebird
 * @requires kafka-topic-producer
 * @requires simple-csv-file-parser
 */

"use strict";

//================================================================================
// dependencies
//================================================================================
const Promise = global.Promise = require("bluebird");
const kafkaProd = require("kafka-topic-producer");

const fileParser = require("simple-csv-file-parser");

//================================================================================
// config
//================================================================================

//================================================================================
// aliases
//================================================================================


//================================================================================
// module
//================================================================================
const dataPath = process.argv[2];

Promise.try(() => {
  return kafkaProd.makeProducer.createCurrentTopic("currentTopic")
    .then(() => {
      //console.log(topicCreated);
      return fileParser.parseFile.parseFile(dataPath);
    })
    .then((allObjects) => {
      return allObjects.map((curObject) => {
        //console.log(curObject);
        return kafkaProd.makeProducer.sendSingleRequest(curObject, "currentTopic");
      });
    });
});



