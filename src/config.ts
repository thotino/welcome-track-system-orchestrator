import config from 'config';
type WebServerConf = { port: number; host: string };
type ConnectionsConf = { elasticsearch: any; kafka: any, zookeeper: any };
type ServiceConf = { name: string; version: string };
export default {
    webserver: config.get('webserver') as WebServerConf,
    connections: config.get('connections') as ConnectionsConf,
    service: config.get('service') as ServiceConf,
}