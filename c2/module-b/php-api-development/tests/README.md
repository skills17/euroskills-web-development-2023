# Phase one - PHP API Development - TESTS

This directory contains the tests for the PHP API Development part.

## Installation

Docker is used as a location development environment.
It depends on the [solution](../solution), so install and set it up first.

Then, execute the following commands to get started:

```bash
docker compose up -d
docker compose exec app php artisan migrate --seed

docker compose exec tests bash

# now inside the docker container, execute the following command to run the tests
composer install
BASE_URL=http://app/ composer test
```

## Extra tests

Extra tests should not be available for the competitors.
Before providing the tests to them, simply remove the `tests/Extra` directory.
