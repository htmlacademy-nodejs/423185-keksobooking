"use strict";

const assert = require(`assert`);
const fs = require(`fs`);
const generate = require(`../src/generator/generate`);
const data = require(`../src/data/raw-data`);
const TEMP_DIR = __dirname;
let file = ``;

const generateFile = () => {
  generate.execute(TEMP_DIR);
  return new Promise((success, fail) => {
    fs.readFile(`${TEMP_DIR}/generatedData.json`, `utf8`, (err, fd) => {
      file = JSON.parse(fd);
      success();
      if (err) {
        fail();
      }
    });
  });
};

describe(`Generate function`, () => {
  generateFile();

  it(`Should create file in exact folder`, () => {
    fs.access(`${TEMP_DIR}/generatedData.json`, (err) => {
      if (err) {
        assert.fail(err);
      }
    });
  });

  it(`Should create file with author, offer, location and date properties`, () => {
    assert.ok(file.author);
    assert.ok(file.offer);
    assert.ok(file.location);
    assert.ok(file.date);
  });

  it(`Author property should contain avatar property`, () => {
    assert.ok(file.author.avatar);
  });

  it(`Location property x and y shoud have correct values`, () => {
    assert.ok(file.location.x > 300 && file.location.x < 900);
    assert.ok(file.location.y > 150 && file.location.y < 500);
  });

  it(`Date property should be in a time stamp format`, () => {
    const date = new Date();
    assert.ok(date.setTime(file.date));
  });

  it(`Offer property should have correct price`, () => {
    assert.ok(file.offer.price > 1000 && file.offer.price < 1000000);
  });

  it(`Offer property should have correct type`, () => {
    const types = data.placeType;
    assert.ok(types.find((item) => item === file.offer.type));
  });

  it(`Offer property should have correct address`, () => {
    assert.ok(typeof file.offer.address === `string`);
  });

  it(`Offer property should have correct title`, () => {
    const types = data.placeTitle;
    assert.ok(types.find((item) => item === file.offer.title));
  });

  it(`Offer property should have correct rooms size`, () => {
    assert.ok(file.offer.rooms > 1 && file.offer.rooms < 5);

  });

  it(`Offer property should have correct guests number`, () => {
    assert.ok(file.offer.guests > 1 && file.offer.guests < 5);
  });

  it(`Offer property should have correct checkin and checkout time`, () => {
    const types = data.time;
    assert.ok(types.find((item) => item === file.offer.checkin));
    assert.ok(types.find((item) => item === file.offer.checkout));
  });

  it(`Offer property should have correct features`, () => {
    const types = data.features;
    assert.ok(file.offer.features.every((item) => types.includes(item)));
  });

  it(`Offer property should have empty description`, () => {
    assert.ok(file.offer.description === ``);
  });

  it(`Offer property should have photos array`, () => {
    const photos = data.photos;
    assert.ok((photos.sort().join(`,`) === file.offer.photos.sort().join(`,`)));
  });

  fs.unlink(`${TEMP_DIR}/generatedData.json`);
});
