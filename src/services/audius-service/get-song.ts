import { app, apiKeyAuth } from '../../core';

app.get<{
  Params: Params;
  Reply: SongReply;
}>('/songs/:id', { onRequest: [apiKeyAuth] }, async (request, reply) => {
  const id = request.params.id;
  request.log.debug({ songId: id }, 'Fetching: Audius song');

  // Fetches song from audius provider...
  const song = await app.db.getSong(id);

  request.log.info({ songId: id, song }, 'Fetched: Audius song');

  return song;
});

app.get<{
  Reply: SongReply[];
}>('/songs', { onRequest: [apiKeyAuth] }, async () => {
  const song1 = await app.db.getSong('3');
  const song2 = await app.db.getSong('4');

  return [song1, song2];
});

interface Params {
  id: string;
}

interface SongReply {
  id: string;
  name: string;
  playCount: number;
}
