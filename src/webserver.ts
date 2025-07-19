/**
 * project JSDoc description
 * @module {Object} module name
 * @version 1.0.0
 * @author author name
 * @requires dependency 1
 * @requires dependency 2
 * ...
 */

//================================================================================
// dependencies
//================================================================================
import fastify, { FastifyInstance } from "fastify";
import dataHandlers from "./lib/handlers";
//================================================================================
// config
//================================================================================
import config from "./config";
import logger from "./logging";

const serverConf = config.webserver;

//================================================================================
// aliases
//================================================================================
/** declare here local variables aliasing some of often used imports / conf options */

//================================================================================
// module
//================================================================================
class WebServer {
    private app: FastifyInstance;

    constructor() {
        this.app = fastify({ logger: logger.fastifyLogger });
        this.setupRoutes();
    }

    private setupRoutes() {
        // Home page
        this.app.get("/", (req, res) => {
            res.send("Hello world!");
        });

        // Get information about an index
        this.app.get(
            "/index/:index",
            {
                schema: {
                    params: {
                        type: "object",
                        properties: {
                            index: { type: "string" },
                        },
                        required: ["index"],
                    },
                    response: {
                        200: {
                            type: "object",
                        },
                    },
                },
            },
            dataHandlers.getIndexInfos,
        );

        // Count documents in an index
        this.app.get("/index/:index/count", {schema: {
            params: {
                type: "object",
                properties: {
                    index: { type: "string" },
                },
                required: ["index"],
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        count: { type: "number" },
                    },
                },
            },
        }}, dataHandlers.countIndexDocuments);

        // Retrieve all entries
        this.app.get("/docs", {schema: {
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                    },
                },
            },
        }}, dataHandlers.retrieveAllEntries);

        // // Retrieve all entries from a specific offset
        // this.app.get("/docs/:offset", dataHandlers.retrieveAllEntriesFromOffset);

        // Retrieve a single entry by ID
        this.app.get("/doc/:id", {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                    },
                    required: ["id"],
                },
                response: {
                    200: {
                        type: "object",
                    },
                },}
        }, dataHandlers.retrieveSingleEntryById);

        // Delete an index
        this.app.delete("/index/:index", {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        index: { type: "string" },
                    },
                    required: ["index"],
                },
                response: {
                    200: {
                        type: "object",
                    },
                },
            },  
        }, dataHandlers.deleteIndex);
    }

    public async start() {
        await this.app.listen({ port: serverConf.port, host: serverConf.host });
        logger.info(
            `Server running at http://${serverConf.host}:${serverConf.port}`,
        );
    }

    public get instance() {
        return this.app;
    }
}

export default WebServer;
