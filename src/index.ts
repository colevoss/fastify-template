import { app } from './core';

// Importing this service will automatically register the routes on the `app`
import './services';

const PORT = process.env.PORT || 8080;

async function main() {
  try {
    app.log.info({ port: PORT }, 'Starting application');
    const address = await app.listen(PORT, '0.0.0.0');
    app.log.info({ address }, 'App started');
    console.log(app.printRoutes());
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
