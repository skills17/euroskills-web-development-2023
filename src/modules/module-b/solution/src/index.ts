import path from 'path';
import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './db/dataSource';
import { setupRoutes } from './routes';
import authentication from './middlewares/authentication';

AppDataSource.initialize().then(async () => {
  console.log('Database connection established');

  const app = express();
  const port = parseInt(process.env.PORT, 10) || 3000;

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  setupRoutes(app);
  nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    noCache: true,
  });

  app.use(express.static(path.join(__dirname, 'static')));

  app.use(authentication);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch(console.error);
