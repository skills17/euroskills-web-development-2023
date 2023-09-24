# Handout Module C

## Previous Solution

To solve this task, you are provided with a working solution of module B.

You can access this solution at the following URL:

`https://sol-b-{your_module_c_hash}.skill17.com`

You can log in using these users:
- Username: `demo1`<br>Password: `skills2023d1`
- Username: `demo2`<br>Password: `skills2023d2`


Your database has been updated to use the latest schema of the provided solution.
In case of any issues, you can re-import it using the file [`database/euroskills2023.sql`](database/euroskills2023.sql).

You can add tables and add data to any tables as you wish. Please do not modify existing tables, as this would break the
provided solution of module B.

## OpenAPI

You can import the spec into Postman to test your API by importing the __folder__ `ai-api` as a collection.

The same works for trying the AI services by importing the __folder__ `provided-ai-services` as a collection.

## AI Services

For this task, you will need access to the three AI services' REST API.

Here are the respective base URLs:

| Service      | Base URL                                     |
|--------------|----------------------------------------------|
| ChatterBlast | https://ai1-{your_module_c_hash}.skill17.com |
| DreamWeaver  | https://ai2-{your_module_c_hash}.skill17.com |
| MindReader   | https://ai3-{your_module_c_hash}.skill17.com |

### Error Handling

To trigger the services to return an error instead of a valid response, you can submit magic strings. This will return a
response with status code `500`.

Here are the respective instructions for each service:

| Service      | Base URL                                         |
|--------------|--------------------------------------------------|
| Chatterblast | Submit `test_error` as conversation ID or prompt |
| Dreamweaver  | Submit `test_error` as a prompt                  |
| Mindreader   | Submit a file with filename `test_error.png`     |

### Inputs

The provided services are not actually implementing any AI. Instead, they are just running some simple algorithms on
the input data. To trigger the services to return a specific response, you can submit magic strings.

Here are the respective instructions for each service:

| Service      | Inputs                                                                                                                                                                   |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Chatterblast | Try `lorem ipsum` for a long response. Try `hello` for a short response. There are a lot of other prompts which will give you a half-decent answer.                      |
| Dreamweaver  | Try `applause`, `cat`, `gdansk`, `opening`, `podium`                                                                                                                     |
| Mindreader   | Try uploading any of the images in [`mindreader-images/`](mindreader-images) . The image [test_error.jpg](mindreader-images/test_error.jpg) will provoke a server error. |
