'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const util = require(`../src/data/util`);
const app = require(`../src/commands/server`).app;

const ENTITIES_COUNT = 28;

describe(`GET /api/offers`, () => {
  it(`get all offers`, () => {
    return request(app)
      .get(`/api/offers`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body.length, ENTITIES_COUNT);
      });
  });

  it(`get all offers with limit param`, () => {
    return request(app)
      .get(`/api/offers?limit=5`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body.length, 5);
      });
  });

  it(`get all offers with skip param`, () => {
    return request(app)
      .get(`/api/offers?skip=25`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body.length, 3);
      });
  });

  it(`get all offers with both skip and limit param`, () => {
    return request(app)
      .get(`/api/offers?skip=25&limit=23`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body.length, 3);
      });
  });

  it(`get all offers with invalid limit param`, () => {
    return request(app)
      .get(`/api/offers?limit=kfkdfkd`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Invalid parameter error`)
      .expect(`Content-Type`, /html/);
  });

  it(`get all offers with invalid skip param`, () => {
    return request(app)
      .get(`/api/offers?skip=-25`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Invalid parameter error`)
      .expect(`Content-Type`, /html/);
  });


  it(`get data from unknown resource`, () => {
    return request(app)
      .get(`/api/starngeurl`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`Page was not found`)
      .expect(`Content-Type`, /html/);
  });
});

describe(`GET /api/offers/:date`, () => {
  let offer;

  before(() => {
    return request(app)
      .get(`/api/offers`)
      .set(`Accept`, `application/json`)
      .then((response) => {
        offer = response.body[3];
      });
  });
  it(`get wizard with true date`, () => {
    return request(app)
      .get(`/api/offers/${offer.date}`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((resp) => {
        assert.deepEqual(resp.body, offer);
      });
  });

  it(`get unknown offer with date "971723378"`, () => {
    return request(app).
      get(`/api/offers/971723378`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`No offers were found at "${util.timestampToDate(971723378)}"`).
      expect(`Content-Type`, /html/);
  });

  it(`get unknown offer with incorrect date`, () => {
    return request(app)
      .get(`/api/offers/starngeurl`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Invalid date error`)
      .expect(`Content-Type`, /html/);
  });

});
