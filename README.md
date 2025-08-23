# WHAT

This module is the orchestration tool for the stream of data. This module allows you to :

- read, parse a file and fill a kafka topic with its content
- consume the messages of the kafka topic and index the data in an Elasticsearch cluster
- launch a HTTP REST server to search for documents in the Elasticsearch cluster

# INSTALL

To install this module and its dependencies, use this set of commands :

```sh
git clone git@github.com:thotino/welcome-track-system-orchestrator.git
cd welcome-track-system-orchestrator
npm install
```

# USE

## REQUIREMENTS

- NodeJS (version 14.5.0) with NPM (version 6.14.5)
- Apache Kafka and Zookeeper
- Elasticsearch
- PM2 (Installed globally)
- Docker (Highly recommanded)

## INSTALL AND RUN ZOOKEEPER AND KAFKA (WITH DOCKER)

Follow these instructions to install and run the Zookeeper and Kafka servers as containers :

```sh

docker network create kafka-net --driver bridge

docker run --name zookeeper-server -p 2181:2181 --network kafka-net -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:latest

docker run --name kafka-server1 --network kafka-net -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper-server:2181 -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -p 9092:9092 bitnami/kafka:latest

```

The zookeeper server is running on the port 2181.
The kafka server is running on the the port 9092.

## INSTALL AND START A SINGLE NODE CLUSTER (WITH DOCKER)

```sh

docker pull docker.elastic.co/elasticsearch/elasticsearch:7.8.0

docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.8.0

```

The Elasticsearch cluster is running on the ports 9200 and 9300.

## EXECUTION PROCEDURE

- Execute the producer script

```sh
node produce.js <DATA_FILE_PATH>
```

.e.g:

```sh
node produce.js data/Export5045.csv
```

This will read the document, parse it, create a Kafka producer instance.
Each line of file will be parsed as a message, that will be added to a Kafka topic. This operation can take time.

- Execute the consumer script

```sh
node consume.js
```

This script creates a Kafka consumer instance to receive the messages. An elasticsearch index (called `tmp-index`) is then created. All the messages are then indexed.

- Execute the HTTP API server

```sh
pm2 start index.js --name welcome-track-server
```

This server will use the port 1200.

## TESTS FOR THE SERVER

Here are some curl command lines you can use to test the server.
First, make sure that the kafka topic was created and fully consumed.

- Get infos on the index (`tmp-index`)

```sh
curl -X GET http://localhost:1200/index/tmp-index
```

- Count the number of documents in the index

```sh
curl -X GET http://localhost:1200/index/tmp-index/count
```

- Get the 10 first documents in the index

```
curl -X GET http://localhost:1200/docs
```

- Get 10 documents from an offset (like a pagination)

```sh
curl -X GET http://localhost:1200/docs/12
curl -X GET http://localhost:1200/docs/120
curl -X GET http://localhost:1200/docs/1200
```

- Get a single document, according to it's ID (delivery ID)

```sh
curl -X GET http://localhost:1200/doc/212682856
curl -X GET http://localhost:1200/doc/207336670
```

- Delete the entire index

```sh
curl -X DELETE http://localhost:1200/index/tmp-index
```

# TESTS

To run the integration tests, use the following command :

```sh
npm test
```

This will test the response of the API server.

<!-- docker build --build-arg SSH_PRV_KEY="$(cat ~/.ssh/id_rsa)" --build-arg SSH_PUB_KEY="$(cat ~/.ssh/id_rsa.pub)" -t orchestrator-server . -->
