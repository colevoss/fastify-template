import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Database } from './database';

export const databasePlugin: FastifyPluginAsync = fp(async (instance) => {
  const db = await Promise.resolve(new Database());

  instance.decorate('db', db);
  instance.addHook('onClose', async (server) => {
    await server.db.close();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
  }
}
