const Promise = require("bluebird");
const request = Promise.promisifyAll(require("request").defaults({jar: true}), {
  filter: (funcName) => { return /put|patch|post|head|del(ete)?|get/u.test(funcName); },
  multiArgs: true,
});
const fs = require("fs-extra");
const expect = require("chai").expect;
const assert = require("chai").assert;
const path = require("path");

const serverBaseURL = "http://127.0.0.1:1200";


const getIndexInfo = function (index = "tmp-index") {
  return request.getAsync({
    url: "http://localhost:1200/index/tmp-index",
    json: true,
  }).then((res) => { return res; });
};

const getIndexCount = function (index = "tmp-index") {
  return request.getAsync({
    url: "http://localhost:1200/index/tmp-index/count",
    json: true,
  }).then((res) => { return res; });
};

const getBunchOfDocuments = function (index = "tmp-index") {
  return request.getAsync({
    url: "http://localhost:1200/docs/12",
    json: true,
  }).then((res) => { return res; });
};

const getASingleDocument = function (index = "tmp-index") {
  return request.getAsync({
    url: "http://localhost:1200/doc/207336670",
    json: true,
  }).then((res) => { return res; });
};

describe("GET INDEX INFOS", () => {
  it("GIVES INFOS ON INDEX", function (done) {
    this.timeout(15000);
    getIndexInfo().then((response) => {
      expect(response[0].statusCode).equal(200);
      done();
    });
  });
});

describe("COUNT INDEX DOCUMENTS", () => {
  it("GIVES THE COUNT OF ALL DOCUMENTS", function (done) {
    this.timeout(15000);
    getIndexCount().then((response) => {
      expect(response[0].statusCode).equal(200);
      done();
    });
  });
});

describe("RETRIEVE DOCUMENTS", () => {
  it("GIVES 10 DOCUMENTS FROM THE OFFSET 12", function (done) {
    this.timeout(15000);
    getBunchOfDocuments().then((response) => {
      expect(response[0].statusCode).equal(200);
      done();
    });
  });
});

describe("RETRIEVE A SINGLE DOCUMENT", () => {
  it("RETRIEVE A DOCUMENT ACCORDING TO THE ID : 207336670", function (done) {
    this.timeout(15000);
    getASingleDocument().then((response) => {
      expect(response[0].statusCode).equal(200);
      done();
    });
  });
});

