import 'dotenv/config';
import http from 'http';
import app from './app';
import os from 'os';
import cluster from 'cluster';
import portfinder from 'portfinder';

const numCPUs = os.cpus().length;

function coba() {}

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const server = http.createServer(app);

  portfinder.setBasePort(3000);
  portfinder
    .getPortPromise({
      host: process.env.HOST,
      port: +process.env.PORT!,
    })
    .then((port) => {
      server.listen(port, () => {
        console.log(
          `Worker process ${process.pid} is listening on port ${port}`
        );
      });
    })
    .catch((err) => {
      console.error(err);
    });
}
