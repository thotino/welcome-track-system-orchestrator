"use strict";
const Promise = global.Promise = require("bluebird");
const kafkaProd = require("kafka-topic-producer");

const fileParser = require("simple-csv-file-parser");

const dataPath = process.argv[2];

Promise.try(() => {
	return kafkaProd.makeProducer.createCurrentTopic("currentTopic")
	.then(() => { 
//console.log(topicCreated);
	return fileParser.parseFile.parseFile(dataPath); })
        .then((allObjects) => {
		
            return allObjects.map((curObject) => {
		//console.log(curObject);
                return kafkaProd.makeProducer.sendSingleRequest(curObject, "currentTopic");
            } ); 
        });
});



