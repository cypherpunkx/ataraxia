import 'dotenv/config';
import http from 'http';
import app from './app';
import os from 'os';
import cluster from 'cluster';
import portfinder from 'portfinder';
import logger from './configs/logger';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  logger.info(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, _code, _signal) => {
    logger.info(`Worker process ${worker.process.pid} died. Restarting...`);
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
        logger.info(
          `Worker process ${process.pid} is listening on port ${port}`
        );
      });
    })
    .catch((err) => {
      logger.error(err);
    });
}
