/*
"use strict";
const Promise = global.Promise = require("bluebird");

const kafkaCons = require("kafka-topic-consumer");

Promise.try(() => {
	kafkaCons.makeConsumer.fromQueueToIndex("currentTopic");
});
*/
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
const kafka = require("kafka-node");
const fs = require("fs-extra");
const path = require("path");
const elasticsearchHandler = require("elasticsearch-helper");

//================================================================================
// config
//================================================================================

//================================================================================
// aliases
//================================================================================
const Consumer = kafka.Consumer;
const Offset = kafka.Offset;

//================================================================================
// module
//================================================================================
const client = new kafka.KafkaClient({"kafkaHost": "127.0.0.1:9092"});
const offset = new Offset(client);

client.on("ready", () => {console.log("client ready!")});

const fieldsArray = ["ID (Livraison)","Nom destinataire"] 

function fromQueueToIndex(topicName) {
    // return new Promise((resolve, reject) => {
        const topicConsumer = new Consumer(client, [], { fromOffset: true });
	//console.log(topicConsumer);
        topicConsumer.on("message", (message) => {
            console.log(message.value);
            elasticsearchHandler.helpers.addObjectToIndex(JSON.parse(message.value), fieldsArray)
                .then((result) => { if(result.statusCode !== 201) { throw "data not indexed"; } });             
        });

        topicConsumer.on("error", (error) => {
            if (error) { throw error; }
        });

        topicConsumer.on("offsetOutOfRange", (topic) => {
  		topic.maxNum = 2;

		  offset.fetch([topic], (err, offsets) => {
		    if (err) {
		      console.log(err);
		    }

		    const min = Math.min(offsets[topic.topic][topic.partition]);
		    topicConsumer.setOffset(topic.topic, topic.partition, min);
		  });
        });

	topicConsumer.addTopics([
  { topic: topicName, partition: 0, offset: 0}
], () => console.log("topic added : ", topicName));
    // });
    
};

fromQueueToIndex("currentTopic");

