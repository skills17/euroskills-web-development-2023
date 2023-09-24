import path from 'path';
import express from 'express';
import nunjucks from 'nunjucks';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './db/dataSource';
import { setupRoutes } from './routes';
import { dateFilter, dateTimeFilter } from './views/filters/date';

AppDataSource.initialize().then(async () => {
  console.log('Database connection established');

  const app = express();
  const port = parseInt(process.env.PORT, 10) || 3000;

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'static')));

  setupRoutes(app);

  const nunEnv = nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    noCache: true,
  });
  nunEnv.addFilter('date', dateFilter);
  nunEnv.addFilter('dateTime', dateTimeFilter);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch(console.error);
