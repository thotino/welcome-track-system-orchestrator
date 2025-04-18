/**
 * project JSDoc description
 * @module {Object} produce
 * @version 1.0.0
 * @author Thotino GOBIN-GANSOU
 * @requires kafka-topic-producer
 * @requires simple-csv-file-parser
 */

"use strict";

//================================================================================
// dependencies
//================================================================================
const kafkaProd = require("./utils/makeProducer");
const fileParser = require("./utils/formatDataFile");

//================================================================================
// config
//================================================================================

//================================================================================
// aliases
//================================================================================


//================================================================================
// module
//================================================================================
const dataPath = process.argv[2] ?? "./data/Export5045.csv";

async function main() {
await kafkaProd.createCurrentTopic("currentTopic")
for await (const line of fileParser.parseFile(dataPath)) {
  await kafkaProd.sendSingleRequest(line, "currentTopic")
}
}
main()



