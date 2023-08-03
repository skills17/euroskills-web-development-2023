import { AppDataSource } from './db/dataSource';
import express from 'express';

AppDataSource.initialize().then(async () => {
  console.log('Database connection established');

  const app = express();
  const port = parseInt(process.env.PORT, 10) || 3000;

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch(console.error);
