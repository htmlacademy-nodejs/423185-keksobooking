'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const entity = require(`../src/data/entity`);

const OffersStoreMock = require(`./mock/offers-store-mock`);
const ImagesStoreMock = require(`./mock/images-store-mock`);

const ENTITIES_COUNT = 18;
const entities = entity.generateMultipleEntities(ENTITIES_COUNT);
const testDate = entities[5].date;
const offersStore = new OffersStoreMock(entities);
const imagesStore = new ImagesStoreMock();

const app = express();

describe(`GET /api/offers`, () => {
  before(() => {
    const offersRouter = require(`../src/offers/route`)(offersStore, imagesStore);
    app.use(`/api`, offersRouter);
  });
  it(`get all offers`, () => {
    return request(app)
      .get(`/api/offers`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body.data.length, ENTITIES_COUNT);
      });
  });

  it(`get all offers with limit param`, () => {
    return request(app)
      .get(`/api/offers?limit=5`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body.data.length, 5);
      });
  });

  it(`get all offers with skip param`, () => {
    return request(app)
      .get(`/api/offers?skip=15`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body.data.length, 3);
      });
  });

  it(`get all offers with both skip and limit param`, () => {
    return request(app)
      .get(`/api/offers?skip=5&limit=10`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body.data.length, 10);
      });
  });

  it(`get all offers with html Accept header`, () => {
    return request(app)
      .get(`/api/offers`)
      .set(`Accept`, `text/html`)
      .expect(200)
      .expect(`Content-Type`, /html/)
      .then((response) => {
        assert.ok(response);
      });
  });

  it(`get all offers with invalid limit param`, () => {
    return request(app)
      .get(`/api/offers?limit=kfkdfkd`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect({error: 400, errorMessage: `Invalid parameter error`})
      .expect(`Content-Type`, /json/);
  });

  it(`get all offers with invalid skip param`, () => {
    return request(app)
      .get(`/api/offers?skip=-25`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect({error: 400, errorMessage: `Invalid parameter error`})
      .expect(`Content-Type`, /json/);
  });


  it(`get data from unknown resource`, () => {
    return request(app)
      .get(`/api/starngeurl`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect({error: 404, errorMessage: `Page was not found`})
      .expect(`Content-Type`, /json/);
  });
});

describe(`GET /api/offers/:date`, () => {
  it(`get wizard with true date`, () => {
    return request(app)
      .get(`/api/offers/${testDate}`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((resp) => {
        assert.deepEqual(resp.body.date, testDate);
      });
  });

  it(`get wizard in html format`, () => {
    return request(app)
      .get(`/api/offers/${testDate}`)
      .set(`Accept`, `text/html`)
      .expect(200)
      .expect(`Content-Type`, /html/)
      .then((resp) => {
        assert.ok(resp.body);
      });
  });

  it(`get unknown offer with date "971723378"`, () => {
    return request(app)
      .get(`/api/offers/971723378`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect({error: 404, errorMessage: `No offers were found at "12.01.1970"`})
      .expect(`Content-Type`, /json/);
  });

  it(`get unknown offer with incorrect date`, () => {
    return request(app)
      .get(`/api/offers/starngeurl`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect({error: 400, errorMessage: `Invalid date error`})
      .expect(`Content-Type`, /json/);
  });
});
