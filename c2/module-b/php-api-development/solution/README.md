# Phase one - PHP API Development - SOLUTION

This directory contains a working solution implemented using Laravel.

## Installation

Docker is used as a location development environment.
Execute the following commands to get started:

```bash
docker compose up -d
docker compose exec app bash

# now inside the docker container, execute the following commands
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
```

The API is then available at [`http://localhost:8080`](http://localhost:8080).
Example request: [`http://localhost:8080/api/v1/concerts`](http://localhost:8080/api/v1/concerts).

Additionally, phpmyadmin is exposed to allow easier database inspection.
It is available at [http://localhost:8081](http://localhost:8081).
Use the hostname `db` and the password specified in the [docker-compose.yml](./docker-compose.yml) file.
