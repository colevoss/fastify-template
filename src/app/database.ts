import { HttpErrors } from '.';

// Mock database to illustrate how we would create a DB instance on the App instance
export class Database {
  public async getSong(id: string) {
    if (id === '1') {
      throw new HttpErrors.NotFound('Song not found', { id });
    }

    return {
      id,
      name: 'The Best Song',
      playCount: 3000,
    };
  }
}
