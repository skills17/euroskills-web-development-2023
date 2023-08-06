# Module B Solution

## Development

To work on this solution, run the following command:
```bash
# Start the app in development mode as the current user (so files have the correct permissions)
UID=${UID} GID=${GID} docker compose up
```

This will start the following components:
- `app`: Express.js app listening on [http://localhost:3000](http://localhost:3000)
- `db`: MariaDB listening on port 3306, password of the root user is `password`
- `phpmyadmin`: PhpMyAdmin instance listening on [http://localhost:8080](http://localhost:8080)

### DB Migrations

To initially run all DB migrations, run the following command:
```bash
docker compose exec --workdir /app app npm run typeorm migration:run -- -d src/db/dataSource.ts
```

To generate new DB migrations, update your models and then run:
```bash
docker compose exec --workdir /app app npm run typeorm migration:generate -- -d src/db/dataSource.ts src/db/migrations/create_x_table
```
Then, add the new migration class in the `src/db/dataSource.ts` file.
