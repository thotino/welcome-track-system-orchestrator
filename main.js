"use strict";

const kafkaProd = require("kafka-topic-producer");
const kafkaCons = require("kafka-topic-consumer");
const databaseHandler = require("elasticsearch-helper");

const data = {
    test: "test",
    foo: "bar",
};


kafkaProd.makeProducer.sendSingleRequest("testTopic", data)
    .then((data) => {console.log(data); return;})
    .then(() => {return kafkaCons.makeConsumer.receiveMessages();})
    .then((messages) => { return  databaseHandler.bulkIndex(messages); });

