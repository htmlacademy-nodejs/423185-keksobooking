'use strict';

class Cursor {
  constructor(data) {
    this.data = data;
  }

  skip(count) {
    return new Cursor(this.data.slice(count));
  }

  limit(count) {
    return new Cursor(this.data.slice(0, count));
  }

  async toArray() {
    return this.data;
  }

  async count() {
    return this.data.length;
  }
}

module.exports = Cursor;
