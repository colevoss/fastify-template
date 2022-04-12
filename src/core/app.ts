import config from 'config';
import fastify, { FastifyLoggerOptions } from 'fastify';
import cors from 'fastify-cors';
import { HttpError } from './errors';
import { databasePlugin } from './database';

const loggerOptions: FastifyLoggerOptions = {
  prettyPrint: config.get<boolean>('Logger.Pretty'),
  level: config.get<string>('Logger.Level'),
};

let reqId = 1;

export const app = fastify({
  logger: loggerOptions,
  /**
   * @see logging.googleapis.com/spanId at https://cloud.google.com/logging/docs/structured-logging
   */
  genReqId(req) {
    let cloudTrace = req.headers['x-cloud-trace-context'];

    if (!cloudTrace) {
      return `${reqId++}`;
    }

    if (Array.isArray(cloudTrace)) {
      cloudTrace = cloudTrace[0];
    }

    const trace = cloudTrace.split('/')[0];

    return `projects/${process.env.GOOGLE_CLOUD_PROJECT}/traces/${trace}`;
  },
  requestIdLogLabel: config.get<string>('Logger.RequestIdLogLabel'),
});

app.register(cors);

app.register(databasePlugin);

app.setErrorHandler((error: HttpError, request, reply) => {
  request.log.warn({ error }, error.message);
  reply.status(error.status || 500).send(error.toJson());
});
