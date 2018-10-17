'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const app = require(`../src/commands/server`).app;

const offerTitle = {title: `Большая уютная квартира`};

describe(`POST /api/offers`, () => {
  it(`send offer as json`, () => {
    return request(app)
      .post(`/api/offers`)
      .send(offerTitle)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body, offerTitle);
      })
      .catch((err) => {
        if (err) {
          throw err;
        }
      });
  });

  it(`send offer as multipart/form-data`, () => {
    return request(app)
      .post(`/api/offers`)
      .field(offerTitle)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body, offerTitle);
      })
      .catch((err) => {
        if (err) {
          throw err;
        }
      });
  });

  it(`send offer with photo as multipart/form-data`, () => {
    return request(app)
      .post(`/api/offers`)
      .field(offerTitle)
      .attach(`photo`, `test/test.png`)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(200)
      .expect(`Content-Type`, /json/)
      .then((response) => {
        assert.deepEqual(response.body, {title: offerTitle.title, photo: {name: `test.png`}});
      })
      .catch((err) => {
        if (err) {
          throw err;
        }
      });
  });

  it(`doesn't accept invalid post urls`, () => {
    return request(app)
      .post(`/api/strangeurl`)
      .field(offerTitle)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`Page was not found`)
      .expect(`Content-Type`, /html/);
  });
});
