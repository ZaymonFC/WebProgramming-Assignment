import * as testDataGenerator from "./data-access.generator.spec"
import makeFileHandler from "../data-access/file-handler"
import * as testUtils from './test-utils'

const assert = require("chai").assert;

const expectedJSON = testDataGenerator.getExampleJSON();

describe("data-reader", () => {
  it("should be invalid if file unavailable", () => {
    let fileHandler = makeFileHandler("unavailable.json");

    fileHandler.checkFileStatus()
      .then(function(result) {
        // Check that the promise does not resolve()
      })
      .catch(err => {
        // Ensure that the promise rejects
        assert.isNotNull(err)
        assert.equal(err, 'unavailable.json does not exist')
        console.log(err)
      })
  })

  it.only('should be valid when file exists', () => {
      let fileHandler = makeFileHandler('./testData/testLoad.json')
      fileHandler.checkFileStatus()
        .then(result => {
          
        })
        .catch(err => {
          console.log(err)
          assert.isNull(err)
        })
  })
});
