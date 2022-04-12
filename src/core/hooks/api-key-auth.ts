import { onRequestHookHandler } from 'fastify';
import { HttpErrors } from '../errors';

export const apiKeyAuth: onRequestHookHandler = (request, reply, done) => {
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
};
