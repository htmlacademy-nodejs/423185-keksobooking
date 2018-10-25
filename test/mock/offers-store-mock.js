
'use strict';

const Cursor = require(`./cursor-mock`);

class OffersStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getOffer(date) {
    return this.data.find((it) => parseInt(it.date, 10) === date);
  }

  async getAllOffers() {
    return new Cursor(this.data);
  }

  async saveOffer() {
    return true;
  }
}

module.exports = OffersStoreMock;
