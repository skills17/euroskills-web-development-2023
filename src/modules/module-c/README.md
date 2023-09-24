# Test Project Outline – Module C — Commercial Open API

This document outlines the description of Module C. It is circulated to the competitors and experts 3 months prior to
the competition. This outline only describes the basic information of module C. The actual test project module will be
created by external Test Project Developers using this outline as a guide. The module description will be presented on
C-2 to all experts. The marking scheme will not be presented or supplied to competitors or experts during the
competition.

## Introduction

Module C will focus on the implementation of a REST API.

## Description of project and Tasks

The competitors will be asked to create a REST API that will be used commercially. The API must be built with features
which allow it to be commercialized and made available publicly and openly. The functionality created by competitors in
this module, builds on top of the functionality created in module B. Competitors will be given a working solution of
Module B at the start of Module C, which they must use. Competitors are not allowed to build on top of their own Module
B solution. This will include the database and the data that is stored in it.

The functionality of the API will be to provide external access to a number of functions, which will be run as separate
services. Those services will all expose a REST API themselves, which however should not be publicly accessible, as they
do not have any level of security and reliability as the commercial API. The code of the services will not be disclosed
to competitors. Instead, a description of the API in the form of an OpenAPI specification and a generated documentation
based on it will be provided. Competitors are supposed to build code which wraps these APIs and exposes them through a
single API. The function services can expose different ways of accessing their features and how to pass and receive
data.

There will also be a specification for the API that competitors are supposed to create. This specification will also be
in the form of an OpenAPI specification and a generated documentation based on it. The specification will describe the
endpoints that competitors are supposed to implement. The specification will also describe the authentication and other
non-functional requirements of the API.

## Assessment

Module C will be assessed using tools which directly access the API created by competitors. The API will be tested for
its functionality and its adherence to the specification. The API will also be tested for its security and reliability.

Any modifications in the provided backend of previous modules, including any changes to the database, will not be taken
into account.

## Competition time

Competitors will have **3 hours** to complete module C.

## Mark distribution

The table below outlines how marks are broken down and how they align with the WorldSkills Occupation Standards (WSOS).
Please read the Technical Description for a full explanation of the WorldSkills Occupation Standards.

| WSOS SECTION | Description                            | Points |
|--------------|----------------------------------------|--------|
| 1            | Work organisation and self-management  | 1      |
| 2            | Communication and interpersonal skills | 1      |
| 3            | Design Implementation                  | 0      |
| 4            | Front-End Development                  | 0      |
| 5            | Back-End Development                   | 15     |
|              |                                        |        |
| **Total**    |                                        | 17     |
