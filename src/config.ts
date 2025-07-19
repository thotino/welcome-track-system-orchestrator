import config from "config";

type WebServerConf = { port: number; host: string };
type ConnectionsConf = {
    elasticsearch: {
        nodes: string[];
        auth: { username: string; password: string };
        index: string;
        logLevel: string;
    };
    kafka: { host: string; groupId: string; topics: Record<string, string> };
    zookeeper: { host: string; port: number; dataDir: string };
};
type ServiceConf = { name: string; logging: { level: string; file: string } };

export default {
    webserver: config.get("webserver") as WebServerConf,
    connections: config.get("connections") as ConnectionsConf,
    service: config.get("service") as ServiceConf,
};
