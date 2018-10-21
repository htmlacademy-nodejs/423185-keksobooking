'use strict';

const supertest = require(`supertest`);
const request = require(`supertest`);
const assert = require(`assert`);
const app = require(`../src/commands/server`).app;
const entity = require(`../src/data/entity`);
const util = require(`../src/data/util`);

const offer = entity.generateEntity();
const avatar = entity.author.avatar;
const entityToNewOffer = entity.entityToNewOfferRequest(offer);
let offerCopy;

describe(`POST /api/offers`, () => {
  it(`send offer with correct data as json`, () => {
    return supertest(app)
      .post(`/api/offers`)
      .send(entityToNewOffer)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
  });

  it(`send offer with correct data as multipart/form-data`, () => {
    return supertest(app)
      .post(`/api/offers`)
      .field(entityToNewOffer)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(200)
      .expect(`Content-Type`, /json/);
  });

  it(`send offer with correct data as multipart/form-data with photo`, () => {
    let photo;

    /* eslint-disable */
    before((done) => util.downloadImage(avatar, request).then(
        ({_res, body}) => {
          photo = body;
          done();
        })
    );
    /* eslint-enable */

    return supertest(app)
      .post(`/api/offers`)
      .field(entityToNewOffer)
      .attach(`photo`, photo)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(200)
      .expect(`Content-Type`, /json/);
  });

  it(`should not send offer with incorrect price as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.price = 1000000;
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `The price should be from 0 to 100 000`);
      });
  });

  it(`should not send offer with incorrect title as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.title = `Современный красивый отель в центре Петербурга получил название Гоголь Хауз, 
      поскольку ранее в этом доме проживал сам Николай Васильевич Гоголь. Он расположен очень удобном месте, 
      где есть все необходимое для отдыха, решения деловых вопросов и т.д. Именно поэтому те, кто планируют 
      посетить Северную Пальмиру, смогут заказать в нем отличный номер, чтобы с максимальной пользой провести 
      имеющееся время для отдыха, экскурсий или решения разного рода деловых задач, вопросов. Профессиональный
       персонал нашего отеля постарается все сделать так, чтобы отдых был комфортным и максимально приятным.`;
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `The title should be a string with a length from 1 to 140 symbols`);
      });
  });

  it(`should not send offer with incorrect address as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.address = `Современный красивый отель в центре Петербурга получил название Гоголь Хауз,
      поскольку ранее в этом доме проживал сам Николай Васильевич Гоголь. Он расположен очень удобном месте, 
      где есть все необходимое для отдыха, решения деловых вопросов и т.д. Именно поэтому те, кто планируют 
      посетить Северную Пальмиру, смогут заказать в нем отличный номер, чтобы с максимальной пользой провести 
      имеющееся время для отдыха, экскурсий или решения разного рода деловых задач, вопросов. Профессиональный 
      персонал нашего отеля постарается все сделать так, чтобы отдых был комфортным и максимально приятным.`;
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `The address should be a string with a length not more than 100 symbols`);
      });
  });

  it(`should not send offer with incorrect type as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.type = `palddddace`;
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `Field name "type" must have correct value!`);
      });
  });

  it(`should not send offer with incorrect checkin as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.checkin = `gfgf:ooop`;
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `Checkin time should be in HH:mm format`);
      });
  });

  it(`should not send offer with incorrect checkout as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.checkout = `gf444gf:oo45op`;
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `Checkout time should be in HH:mm format`);
      });
  });

  it(`should not send offer with incorrect rooms number as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.rooms = 5000;
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `Rooms number should be countable with a length from 0 to 1000`);
      });
  });

  it(`should not send offer with incorrect features as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.features = [`swimming pool`, `cazino`];
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `Invalid features`);
      });
  });

  it(`should not send offer with incorrect features and rooms as json`, () => {
    offerCopy = Object.assign({}, entityToNewOffer);
    offerCopy.features = [`swimming pool`, `cazino`];
    offerCopy.rooms = 5000;
    return supertest(app)
      .post(`/api/offers`)
      .send(offerCopy)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/)
      .then((err) => {
        assert.deepEqual(err.body[0], `Rooms number should be countable with a length from 0 to 1000`);
        assert.deepEqual(err.body[1], `Invalid features`);
      });
  });

  it(`doesn't accept invalid post urls`, () => {
    return supertest(app)
      .post(`/api/strangeurl`)
      .send(entityToNewOffer)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`Page was not found`)
      .expect(`Content-Type`, /html/);
  });
});