import { app } from '../../app';

interface Params {
  id: string;
}

interface SongReply {
  id: string;
  name: string;
  playCount: number;
}

app.get<{
  Params: Params;
  Reply: SongReply;
}>('/songs/:id', async (request, reply) => {
  const id = request.params.id;
  request.log.debug({ songId: id }, 'Fetching: Audius song');

  // Fetches song from audius provider...
  const song = await app.db.getSong(id);

  return song;
});
