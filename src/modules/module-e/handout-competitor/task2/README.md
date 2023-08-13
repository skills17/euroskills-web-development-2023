# Handout Module E - Task 2

## Starting the API

To start the API, run the following command in a terminal on your local machine:
```bash
docker run --rm -it -p 3000:3000 <TODO-IMAGE-NAME>
```

After that, the API is available at [http://localhost:3000](http://localhost:3000), and, for example, the list of news is reachable at [http://localhost:3000/api/news](http://localhost:3000/api/news).
A specification of the API is provided to you in the [api-spec.html](./api-spec.html) and [api-spec.yaml](./api-spec.yaml) files.

You can start and stop this container as you wish to test the caching behavior of the web app in case the API cannot be reached.

## Starting the frontend server

Because PWAs do not work with file URLs, a simple HTTP server is provided to you.

Open a terminal on your local machine **inside this folder** and run the following command:
```bash
docker run --rm -it -p 8080:8080 -v ./src:/app/src <TODO-IMAGE-NAME>
```

Your web app is then available at [http://localhost:8080](http://localhost:8080).

## Provided template

A simple template is already provided to you within the `src` folder.
It provides a starting point and you can extend it to implement the requested functionality.
