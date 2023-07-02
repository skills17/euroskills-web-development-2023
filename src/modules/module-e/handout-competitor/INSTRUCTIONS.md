# Module E – Advanced Web Development

In this module, you are expected to solve three tasks.

Within the media files, you will find three starter kits for each task. You are expected to use these starter kits as a
base for your solution. You are not allowed to use any frameworks or libraries for this module except a
testing framework for task 1.

## Task 1: Writing automated tests

You are given a JavaScript project that has no automated tests. You have to write automated unit tests for the project.
A complete test set is expected which covers 100% of the provided code lines and conditionals. A JavaScript testing
framework must be used.

These are the assessment criteria for this task:

- The tests are grouped logically.
- The tests are written in a way that they are easy to understand.
- The tests pass when running against the original code.
- The tests cover 100% of the provided code lines and conditionals.
- The tests do not pass any logically mutated version of that code (Mutation Testing).

## Task 2: Creating a Progressive Web App (PWA)

Your task is to create a progressive web app for an AI news site.
The backend is already provided to you with an OpenAPI specification explaining the available endpoints.
The frontend has to be created from scratch. However, functionality is more important than look and feel.

The app has the following requirements:

- It can be installed on the user's device
- There is one view, showing all recent news articles in a list
- It has to work offline, meaning the last successfully loaded news articles are shown if the user does not have an Internet connection
- Notifications about new articles can be received as explained below and open the app to the list view when clicked

### Notifications

As the competition takes place in an offline environment, it is not possible to implement real push notifications.
Therefore, they have to be implemented a bit differently and for this to work, the app needs to be always open.

- The app polls the provided endpoint every 10 seconds in the background
- If there is a new article, a notification should be shown, but only if the app is not visible at the moment (open in the background or in another tab)

## Task 3: Creating a Web Component

TODO
