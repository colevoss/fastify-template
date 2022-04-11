import { app } from './app';

// Importing this service will automatically register the routes on the `app`
import './services/audius-service';

const PORT = process.env.PORT || 8080;

async function main() {
  try {
    const address = await app.listen(PORT, '0.0.0.0');
    console.log(`App listening at ${address}`);
    console.log(app.printRoutes());
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
