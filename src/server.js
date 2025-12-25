require('dotenv').config();
const http = require('http');
const app = require('./app');
const config = require('./config');

const server = http.createServer(app);

function start(port = config.PORT) {
  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      resolve(server);
    });
  });
}

function stop() {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

if (require.main === module) {
  start();
}

module.exports = { start, stop, server };
