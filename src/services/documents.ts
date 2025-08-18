import IndicesRepository from "../repositories/indices.js";

export default class DocumentsService {
    static async getDocument(docId: string) {
        return await IndicesRepository.searchDocuments({
            index: "documents",
            id: docId,
        });
    }

    static async *getAllDocuments() {
        const response = await IndicesRepository.searchDocuments({
            index: "documents",
            body: {
                query: {
                    match_all: {},
                },
                size: 1000, // Adjust size as needed
                search_after: [],
            },
        });

        for (const hit of response.hits.hits) {
            yield hit;
        }
    }
    
}