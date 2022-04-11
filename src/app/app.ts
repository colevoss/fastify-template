import config from 'config';
import fastify, {
  FastifyLoggerOptions,
  FastifyInstance,
  FastifyPluginOptions,
} from 'fastify';
import fp from 'fastify-plugin';
import cors from 'fastify-cors';
import { Database } from './database';
import { HttpError, HttpErrors } from './errors';

const loggerOptions: FastifyLoggerOptions = {
  prettyPrint: config.get<boolean>('Logger.Pretty'),
  level: config.get<string>('Logger.Level'),
};

export const app = fastify({
  logger: loggerOptions,
  // Pulls the `custom-request-id` header for the tracing request id
  requestIdHeader: 'custom-request-id',
  // Sets the request id to this key in the logs.
  requestIdLogLabel: 'my-custom-request-id',
});

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
  }
}

app.register(cors);

// Example plugin to set the database value on `app
app.register(
  fp(
    (
      instance: FastifyInstance,
      options: FastifyPluginOptions,
      done: (err?: Error) => void,
    ) => {
      instance.decorate('db', new Database());
      done();
    },
  ),
);

app.addHook('onRequest', (request, reply, done) => {
  const rtApiKey = request.headers['rt-api-key'];

  if (!rtApiKey) {
    done(new HttpErrors.Unauthorized('RT-API-KEY header required'));
    return;
  }

  if (rtApiKey !== 'the-api-key') {
    done(new HttpErrors.Unauthorized('Invalid RT-API-KEY request header'));
    return;
  }

  done();
});

app.setErrorHandler((error: HttpError, request, reply) => {
  request.log.warn({ error }, error.message);
  reply.status(error.status || 500).send(error.toJson());
});
