"use strict";

const http = require(`http`);
const url = require(`url`);
const path = require(`path`);
const fs = require(`fs`);

const HOST_NAME = `127.0.0.1`;
const DEFAULT_PORT = 3000;
const CURRENT_DIR = __dirname;
const mimes = {
  ".html": `text/html; charset=UTF-8`,
  ".css": `text/css`,
  ".gif": `image/gif`,
  ".jpg": `image/jpeg`,
  ".jpeg": `image/jpeg`,
  ".js": `application/javascript`,
  ".json": `application/json`,
  ".png": `image/png`,
  ".svg": `image/svg`,
  ".ico": `image/x-icon`
};

const checkPort = () => {
  const args = process.argv.slice(2);
  const serverPort = args[1] ? args[1].trim() : ``;
  if (parseInt(serverPort, 10)) {
    return serverPort;
  } else {
    return DEFAULT_PORT;
  }
};

const showMarkup = (filePath, files) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Directory content</title>
  </head>
  <body>
  <ul>
      ${files
      .map((it) => `<li><a href="${filePath}/${it}">${it}</a></li>`)
      .join(``)}
  </ul>
  </body>
  </html>`;
};

const showFile = (filePath, res) => {
  return new Promise((success) => {
    fs.readFile(filePath, (err, files) => {
      success(files);
    });
  })
    .then((fd) => {
      const extension = path.parse(filePath).ext;
      const data = fd.toString(`utf8`);
      const length = Buffer.from(data, `utf8`).length;
      res.setHeader(`Content-Type`, mimes[extension]);
      res.setHeader(`Content-Length`, length);
      res.end(fd);
    })
    .catch((e) => {
      res.writeHead(500, e.message, {'content-type': `text/plain`});
      res.end(`500 Something went wrong`);
    });
};

const showDirectory = (filePathAbosulte, filePathRelative, res) => {
  return new Promise((success) => {
    fs.readdir(filePathAbosulte, (err, files) => {
      success(files);
    });
  })
    .then((files) => {
      res.setHeader(`content-type`, `text\html`);
      const markup = showMarkup(filePathRelative, files);
      res.end(markup);
    })
    .catch((e) => {
      res.writeHead(500, e.message, {'content-type': `text/plain`});
      res.end(`500 Something went wrong`);
    });
};

const serverHandler = (req, res) => {
  let localPath = url.parse(req.url).pathname;
  if (localPath === `/`) {
    localPath = `/index.html`;
  }

  const absolutePath = path.join(CURRENT_DIR, `../static`, localPath);
  return new Promise((success) => {
    fs.stat(absolutePath, (err, stats) => {
      if (err) {
        res.writeHead(404, `Not Found`);
        res.end(`404 Not Found`);
      }
      res.statusCode = 200;
      res.statusMessage = `OK`;
      success(stats);
    });
  })
    .then((data) => {
      if (data.isDirectory()) {
        showDirectory(absolutePath, localPath, res);
      } else if (data.isFile()) {
        showFile(absolutePath, res);
      }
    })
    .catch((e) => {
      res.writeHead(500, e.message, {'content-type': `text/plain`});
      res.end(`500 Something went wrong`);
    });
};

const launchServer = (port) => {
  const server = http.createServer();
  server.on(`request`, serverHandler);
  server.listen(port, HOST_NAME, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server launched!\nConnect: http://${HOST_NAME}:${port}`);
  });
};

module.exports = {
  name: `server`,
  description: `запускает сервер`,
  execute() {
    const port = checkPort();
    launchServer(port);
  }
};
