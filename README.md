# WHAT
This module is the orchestration tool for the stream of data. This module allows you to : 
* read, parse a file and fill a kafka topic with its content
* consume the messages of the kafka topic and index the data in an Elasticsearch cluster
* launch a HTTP REST server to search for documents in the Elasticsearch cluster
 
# INSTALL

# USE
## REQUIREMENTS
* NodeJS
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
## 
* Launch the Zookeeper and Kafka servers

* Install the dependencies with `npm`
* Execute the producer script
* Execute the consumer script

* 

