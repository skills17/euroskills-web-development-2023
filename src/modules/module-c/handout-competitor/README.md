# Handout Module C

## Previous Solution

To solve this task, you are provided with a solution of module B.

You can access it via the following URL:

```
http://TODO
```

## AI Services

For this task, you will need access to the three AI services' REST API.

Here are the respective base URLs:

| Service      | Base URL          |
|--------------|-------------------|
| Chatterblast | http://TODO:9001/ |
| Dreamweaver  | http://TODO:9002/ |
| Mindreader   | http://TODO:9003/ |

### Error Handling

To trigger the services to return an error instead of a valid response, you can submit magic strings. This will return a
response with status code `500`.

Here are the respective instructions for each service:

| Service      | Base URL                                     |
|--------------|----------------------------------------------|
| Chatterblast | Submit `test_error` as conversation ID       |
| Dreamweaver  | Submit `test_error` as a prompt              |
| Mindreader   | Submit a file with filename `test_error.png` |
