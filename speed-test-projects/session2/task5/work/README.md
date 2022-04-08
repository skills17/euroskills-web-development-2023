# Task 5

## Installation

```bash
docker compose up -d
docker compose exec task composer install
```

## Running tests

Run tests once and print results with achieved points:
```bash
docker compose exec task composer test
```

Run tests and get results as JSON:
```bash
docker compose exec task composer test:json
```
