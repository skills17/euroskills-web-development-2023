# Test Project Outline – Module B — API Development & Consumption

This document outlines the description of Module B. It is circulated to the competitors and experts 3 months prior to the competition. This outline only describes the basic information of module B. The actual test project module will be created by external Test Project Developers using this outline as a guide. The module description will be presented on C-2 to all experts. The marking scheme will not be presented or supplied to competitors or experts during the competition.

## Introduction

Module B will focus on API development and consumption. The object of this module is to create a web application for a specified client with a separate API and frontend. For competitors that are not able to implement all features of the API, a mock API will be provided to still allow them to create a fully working frontend. The breakdown of points can be found in a table at the end of this document.

## Description of project and Tasks

The competitors will be asked to create a web application that is divided into a separate RESTful API and a frontend.

The RESTful API will use a MySQL database provided by the client. The client will also provide a list of all desired API endpoints as well as a detailed description of each request and the expected response. As the client is already in contact with a different agency to create a native app that will consume the same API, the API needs to be exactly implemented as described, including response format, header fields, and HTTP status codes.

The frontend of the web application will consume the previously created API and provide a user interface for the client's customers that conforms to accessibility standards. The client will provide you any content needed for the frontend, such as images, icons, text, and other media.

The web application will implement login functionality and should consider security issues. It will also include upload functionality for images.

## Assessment

Module B will be assessed using the latest stable version of Firefox. HTML and CSS will be assessed using W3C validators. Accessibility will be tested using axe.

Where possible, automated unit and end-to-end tests with PHPUnit and Cypress will be used to assess measurement marks.

## Competition time

Competitors will have **5.5 hours** to complete module B.

## Mark distribution

The table below outlines how marks are broken down and how they align with the WorldSkills Occupation Standards (WSOS). Please read the Technical Description for a full explanation of the WorldSkills Occupation Standards.

| WSOS SECTION | Description                            | Points |
|--------------|----------------------------------------|--------|
| 1            | Work organisation and self-management  | 2      |
| 2            | Communication and interpersonal skills | 1      |
| 3            | Website design                         | 6      |
| 4            | Layout                                 | 4      |
| 5            | Front-End Development                  | 10     |
| 6            | Back-End Development                   | 14     |
| 7            | Content Management Systems             | 0      |
|              |                                        |        |
| **Total**    |                                        | 37     |
