"use strict";

const {Readable} = require(`stream`);

class FsGridStream extends Readable {
  constructor(buffer) {
    super();
    this.buffer = buffer;
    this.chunk = this.readableHighWaterMark;
  }

  _read() {
    const len = this.buffer.length;
    let start = 0;

    while (start <= len) {
      this.push(this.buffer.slice(start, start + this.chunk));
      start += this.chunk;
    }

    this.push(null);
  }
}

module.exports = FsGridStream;
