# Handout Module E - Task 1

## Running the project

To run the project and check the implementation, execute the following command in a terminal on your local machine **inside this folder**:
```bash
docker run --rm -it -v ./src:/app/src <TODO-IMAGE-NAME> start
```

## Running the tests

To run the Jest tests once, execute the following command in a terminal on your local machine **inside this folder**:
```bash
# Run all tests:
docker run --rm -it -v ./src:/app/src <TODO-IMAGE-NAME> test

# Run only a single file:
docker run --rm -it -v ./src:/app/src <TODO-IMAGE-NAME> test -- -i ./src/InputReader.test.js

# Run only tests that match the provided name:
docker run --rm -it -v ./src:/app/src <TODO-IMAGE-NAME> test -- -t test-name
```

To run the Jest tests in watch mode, execute the following command in a terminal on your local machine **inside this folder**:
```bash
docker run --rm -it -v ./src:/app/src -v ./coverage:/app/coverage <TODO-IMAGE-NAME> test:watch
```
After each save of a source or test file, the tests will be rerun automatically.
See the `Watch Usage` section which gets printed out after starting the command for possibilities to filter tests.

To generate a coverage report for a single run, execute the following command in a terminal on your local machine **inside this folder**:
```bash
docker run --rm -it -v ./src:/app/src -v ./coverage:/app/coverage <TODO-IMAGE-NAME> test:coverage
```

## Test coverage

When running the tests in watch mode or the dedicated coverage command, a coverage report will be generated inside the `coverage` folder.
Simply open [coverage/index.html](./coverage/index.html) in your browser to view it.
