# WHAT
This module is the orchestration tool for the stream of data. This module allows you to : 
* read, parse a file and fill a kafka topic with its content
* consume the messages of the kafka topic and index the data in an Elasticsearch cluster
* launch a HTTP REST server to search for documents in the Elasticsearch cluster
 
# INSTALL
```sh
git clone git@github.com:thotino/welcome-track-system-orchestrator.git
cd welcome-track-system-orchestrator
npm install
```
# USE
## REQUIREMENTS
* NodeJS (version 14.5.0) with NPM (version 6.14.5)
* Apache Kafka 
* Elasticsearch
* Docker (optional but recommanded)

## INSTALL AND RUN ZOOKEEPER AND KAFKA (WITH DOCKER)
Follow these instructions to install and run the Zookeeper and Kafka servers as containers : 
```sh

docker network create kafka-net --driver bridge

docker run --name zookeeper-server -p 2181:2181 --network kafka-net -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:latest

docker run --name kafka-server1 --network kafka-net -e ALLOW_PLAINTEXT_LISTENER=yes -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper-server:2181 -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -p 9092:9092 bitnami/kafka:latest

```

## INSTALL AND START A SINGLE NODE CLUSTER (WITH DOCKER)
```sh

docker pull docker.elastic.co/elasticsearch/elasticsearch:7.8.0

docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.8.0

```
## EXECUTION
* Launch the Zookeeper and Kafka servers
* Install the dependencies with `npm`
* Execute the producer script 
```sh
node produce.js data/Export5045.csv
```
* Execute the consumer script
```sh
node consume.js
```
* Execute the HTTP API server
```sh
pm2 start index.js --name welcome-track-server
```
### TESTS FOR THE SERVER
```sh
curl -X GET http://localhost:1200/index/tmp-index
curl -X GET http://localhost:1200/index/tmp-index/count
curl -X GET http://localhost:1200/docs
curl -X GET http://localhost:1200/docs/12
curl -X GET http://localhost:1200/docs/120
curl -X GET http://localhost:1200/docs/1200
curl -X GET http://localhost:1200/doc/212682856
curl -X GET http://localhost:1200/doc/207336670
curl -X DELETE http://localhost:1200/index
```
