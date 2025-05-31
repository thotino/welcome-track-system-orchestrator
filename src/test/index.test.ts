import { describe, test, expect } from "vitest";
import app from "../webserver";

describe("GET INDEX INFOS", () => {
    test("GIVES INFOS ON INDEX", async function () {

        const response = await app.inject({url: "/index/tmp-index"});
        expect(response.statusCode).equal(200);
    });
});

describe("COUNT INDEX DOCUMENTS", () => {
    test("GIVES THE COUNT OF ALL DOCUMENTS", async function () {
        const response = await app.inject({ url: "/index/tmp-index/count" });
        expect(response.statusCode).equal(200);
    });
});

describe("RETRIEVE DOCUMENTS", () => {
    test("GIVES 10 DOCUMENTS FROM THE OFFSET 12", async function () {
        const response = await app.inject({ url: "/docs/12" });
        expect(response.statusCode).equal(200);
    });
});

describe("RETRIEVE A SINGLE DOCUMENT", () => {
    test("RETRIEVE A DOCUMENT ACCORDING TO THE ID : 207336670", async function () {
        const response = await app.inject({ url: "/doc/207336670" });
        expect(response.statusCode).equal(200);
    });
});
