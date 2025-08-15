import IndicesRepository from "../repositories/indices.js";

export default class IndicesService {
    static async getIndiceInfo() {
        return await IndicesRepository.getInfos("welcome-track");
    }
    static async deleteIndex() {
        return await IndicesRepository.deleteIndex("welcome-track");
    }
    static async createIndex() {
        return await IndicesRepository.createIndex("welcome-track");
    }
}