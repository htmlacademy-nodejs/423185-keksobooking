"use strict";

const assert = require(`assert`);
const fs = require(`fs`);
const path = require(`path`);
const generate = require(`../src/generator/generate`);
const data = require(`../src/data/raw-data`);
const generateEntity = require(`../src/data/entity.js`);

const TEMP_DIR = __dirname;
const object = generateEntity();

const writeFile = (itemsNumber) => {
  return new Promise((success) => {
    generate.execute(TEMP_DIR, itemsNumber)
      .then(() => {
        fs.access(path.join(TEMP_DIR, `generated-data.json`), () => {
          success();
        });
      });
  });
};

const readFile = () => {
  return new Promise((success, fail) => {
    fs.readFile(path.join(TEMP_DIR, `generated-data.json`), `utf8`, (err, fd) => {
      if (err) {
        return fail(err);
      }
      return success(JSON.parse(fd));
    });
  });
};

describe(`Generate function`, () => {
  it(`Should create file in exact folder`, () => {
    return writeFile(1)
      .catch((err) => {
        assert.fail(err);
      });
  });

  it(`Should successfully rewrite file`, () => {
    return writeFile(1)
      .then(() => {
        writeFile(1);
      })
      .catch((err) => {
        assert.fail(err);
      });
  });

  it(`Should create file with array length, depending on the set argument`, () => {
    return writeFile(12)
      .then(() => {
        return readFile();
      })
      .then((fileData) => {
        assert.ok(fileData.length === 12);
      })
      .catch((err) => {
        assert.fail(err);
      });
  });

  it(`Should create file with author, offer, location and date properties in an object`, () => {
    return writeFile(5)
      .then(() => {
        return readFile();
      })
      .then((fileData) => {
        assert.ok(fileData[2].author);
        assert.ok(fileData[2].offer);
        assert.ok(fileData[2].location);
        assert.ok(fileData[2].date);
      })
      .catch((err) => {
        assert.fail(err);
      });
  });
});


describe(`Generated object in an array`, () => {
  it(`Author property should contain avatar property`, () => {
    assert.ok(object.author.avatar);
  });

  it(`Location property x and y shoud have correct values`, () => {
    assert.ok(object.location.x >= 300 && object.location.x <= 900);
    assert.ok(object.location.y >= 150 && object.location.y <= 500);
  });

  it(`Date property should be in a time stamp format`, () => {
    const date = new Date();
    assert.ok(date.setTime(object.date));
  });

  it(`Offer property should have correct price`, () => {
    assert.ok(object.offer.price >= 1000 && object.offer.price <= 1000000);
  });

  it(`Offer property should have correct type`, () => {
    const types = data.placeTypes;
    assert.ok(types.find((item) => item === object.offer.type));
  });

  it(`Offer property should have correct address`, () => {
    assert.ok(typeof object.offer.address === `string`);
  });

  it(`Offer property should have correct title`, () => {
    const types = data.placeTitles;
    assert.ok(types.find((item) => item === object.offer.title));
  });

  it(`Offer property should have correct rooms size`, () => {
    assert.ok(object.offer.rooms >= 1 && object.offer.rooms <= 5);

  });

  it(`Offer property should have correct guests number`, () => {
    assert.ok(object.offer.guests >= 1 && object.offer.guests <= 5);
  });

  it(`Offer property should have correct checkin and checkout time`, () => {
    const types = data.time;
    assert.ok(types.find((item) => item === object.offer.checkin));
    assert.ok(types.find((item) => item === object.offer.checkout));
  });

  it(`Offer property should have correct features`, () => {
    const types = data.features;
    assert.ok(object.offer.features.every((item) => types.includes(item)));
  });

  it(`Offer property should have empty description`, () => {
    assert.ok(object.offer.description === ``);
  });

  it(`Offer property should have photos array`, () => {
    const photos = data.photos;
    assert.ok((photos.sort().join(`,`) === object.offer.photos.sort().join(`,`)));
  });

  after((done) => {
    fs.unlink(path.join(TEMP_DIR, `generated-data.json`), () => {
      done();
    });
  });
});
