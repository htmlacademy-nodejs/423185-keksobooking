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

const sendFile = (file, res) => {
  file.pipe(res);

  file.on(`error`, () => {
    res.writeHead(404, `Not Found`);
    res.end();
  });

  res.on(`close`, () => {
    file.destroy();
  });
};

const showFile = (filePath, res) => {
  return new Promise(() => {
    const file = fs.createReadStream(filePath);
    return sendFile(file, res);
  })
    .then((fd) => {
      const extension = path.parse(filePath).ext;
      res.setHeader(`content-type`, mimes[extension]);
      res.end(fd);
    })
    .catch((e) => {
      res.writeHead(500, e.message, {'content-type': `text/plain`});
      res.end(e.message);
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
      res.end(e.message);
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
        res.end();
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
      res.end(e.message);
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
