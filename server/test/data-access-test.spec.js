import * as testDataGenerator from "./data-access.generator.spec";
import makeFileHandler from "../data-access/file-handler";

const assert = require("chai").assert;

const expectedJSON = testDataGenerator.getExampleJSON();

describe("data-reader", () => {
  it("should be invalid if file unavailable", () => {
    let fileHandler = makeFileHandler("unavailable.json");
    fileHandler.checkFileStatus()
      .then(function(result) {
        // Should not be called
      },
      function(err) {
        assert.isNotNull(err)
        console.log(err)
      })
  })

  // it('should read in file as JSON', () => {
  //     const loadedJson = LoadFileContents('testdata/loadTest.json')
  //     assert.equal(loadedJson, expectedJSON)
  // })
});
