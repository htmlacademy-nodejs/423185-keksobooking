'use strict';

const assert = require(`assert`);
const fs = require(`fs`);
const generate = require(`../src/generator/generate`);

describe(`Generate function`, () => {
  it(`Should create file in exact folder`, () => {
    const tempDir = __dirname;
    generate.execute(tempDir);
    fs.access(`${tempDir}/generatedData.json`, (err) => {
      if (err) {
        assert.fail(err);
      }
    });
    assert.ok(1);
    fs.unlink(`${tempDir}/generatedData.json`);
  });
});
