# Handout Module E - Task 1

## Install

Please run the following command once **inside this folder** to install the required packages:
```bash
npm set registry http://registry.skill17.com:5000
npm install
```

## Running the project

To run the project and check the implementation, execute the following command in a terminal on your local machine **inside this folder**:
```bash
npm start
```

## Running the tests

To run the Jest tests once, execute the following command in a terminal on your local machine **inside this folder**:
```bash
# Run all tests:
npm run test

# Run only a single file:
npm run test -- -i ./src/InputReader.test.js

# Run only tests that match the provided name:
npm run test -- -t test-name
```

To run the Jest tests in watch mode, execute the following command in a terminal on your local machine **inside this folder**:
```bash
npm run test:watch
```
After each save of a source or test file, the tests will be rerun automatically.
See the `Watch Usage` section which gets printed out after starting the command for possibilities to filter tests.

To generate a coverage report for a single run, execute the following command in a terminal on your local machine **inside this folder**:
```bash
npm run test:coverage
```

To generate a mutation report for a single run, execute the following command in a terminal on your local machine **inside this folder**:
```bash
npm run test:mutation
```

## Test coverage

When running the tests in watch mode or the dedicated coverage command, a coverage report will be generated inside the `coverage` folder.
Simply open [coverage/index.html](./coverage/index.html) in your browser to view it.
