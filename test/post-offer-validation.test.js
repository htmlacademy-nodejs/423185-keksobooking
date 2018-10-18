'use strict';

const request = require(`supertest`);
const app = require(`../src/commands/server`).app;
const entity = require(`../src/data/entity`);

const offer = entity.generateEntity();
const offerTest = Object.assign({}, offer, {type: `palace`});

describe(`POST /api/offers validate`, () => {
  it(`send offer with invalid type`, () => {
    return request(app)
            .post(`/api/offers`)
            .send(offerTest)
            .set(`Accept`, `application/json`)
            .expect(400)
            .expect(`Field name "type" must have correct value!`)
            .expect(`Content-Type`, /html/);

  });
});
