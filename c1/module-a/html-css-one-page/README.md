# C1 - Phase two - Static HTML / CSS

In this phase you are expected to develop a one-page website for a client.
The goal of the website is to advertise a one-day music concert where multiple different artists will perform.

The client wants to have a Minimum Viable Product (MVP) of the website as a first iteration. This can be deployed on a server and made
available to the public to learn how the first users interact with it. Once this MVP is released, development on further
content of the website can continue. This second iteration will be the Minimum Marketable Product (MMP).

During your development you are supposed to follow the contribution rules the client has described, so they can
integrate the code into their Version Control (Git). You will find the contribution guidelines in a separate document
called `CONTRIBUTING.md`.

Within the media files, the client already provides you some media, icons, and text.
You are free to use them but can also create them on your own as long as the website still fulfills the purpose.

The website should be responsive and support at least the following viewports:
- Mobile: 360x640
- Tablet: 768x1024
- Desktop: 1920x1080

The clients wants to support the two most used browsers: Google Chrome and Firefox.

## Competitor Information

The final website after iteration 2 has to be available at `http://<hostname>/module-a/phase2`.
Iteration 1 does not have to be available on the server.

Tests are provided that check for accessibility violations, and HTML and CSS validation errors.

To run the tests, execute `npm start -- --config baseUrl=http://<hostname>/module-a/phase2` (replace `http://<hostname>/` with the URL of your server VM).
Please note that **localhost cannot** be used in the validation tests as the underlying tool does not permit it.
Therefore, you must start the tests on your local client with the server URL.

## MVP - Iteration 1

For the MVP, the client wants a simple landing page that engages users to get interested in the music concert
and check back when the full website with all information is available.

The client's vision for the landing page is that the website uses exactly the full width and height of the browser
so there is no empty space and also no scrolling needed.
Some kind of media should also be used to attract users.

Additionally, the following information must be visible:
- Name of the event: **Stars in Graz**
- Date of the music concert: **30.10.2021**
- Location of the music concert: **Messe Congress Graz**
- Date when the full website with all the information will be available: **25.09.2021**

You are free to add any other information and elements that you think are useful.

When the MVP is ready, create a release according to the contribution rules.

## MMP - Iteration 2

The MVP from iteration 1 should now get extended to contain all available information and sections the client wants.
To make sure the users recognise the website, the landing page from iteration 1 has still to be part of it.
All additional sections have to be placed below on the same page and it has to be clear to the user that they can scroll down to see more. The navigation menu can also be placed over the existing landing page section.

The following additional sections are required:
- A navigation menu with links to all the other sections
- The concert schedule
- Purchase tickets button (it does not have to point to a valid URL, the client will update it on their own)
- At least one testimonial from a visitor from last year
- Frequently asked questions

Texts for the sections are provided within the mediafiles folder.

For each section, create a separate feature according to the contribution rules.
Once everything is ready, create a release that the client can then deploy.
